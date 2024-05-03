<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetTree;

use GuzzleHttp\Psr7\Uri;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\NodeType\NodeTypeConstraintFactory;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContextFactory;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodeBuilder;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodes;
use Sitegeist\Archaeopteryx\Infrastructure\ContentRepository\NodeSearchService;
use Sitegeist\Archaeopteryx\Infrastructure\ContentRepository\NodeTypeFilter;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetTreeQueryHandler
{
    #[Flow\Inject]
    protected ContentContextFactory $contentContextFactory;

    #[Flow\Inject]
    protected NodeTypeManager $nodeTypeManager;

    #[Flow\Inject]
    protected NodeSearchService $nodeSearchService;

    #[Flow\Inject]
    protected NodeTypeConstraintFactory $nodeTypeConstraintFactory;

    public function handle(GetTreeQuery $query): GetTreeQueryResult
    {
        $contentContext = $this->contentContextFactory->create([
            'workspaceName' => $query->workspaceName,
            'dimensions' => $query->dimensionValues,
            'targetDimensions' => $query->getTargetDimensionValues(),
            'invisibleContentShown' => true,
            'removedContentShown' => false,
            'inaccessibleContentShown' => true
        ]);

        $rootNode = $contentContext->getNode((string) $query->startingPoint);
        if (!$rootNode instanceof Node) {
            throw new \Exception('Forget it!');
        }

        return new GetTreeQueryResult(
            root: $tree = empty($query->searchTerm) && empty($query->leafNodeTypeFilter)
                ? $this->createTreeNodeFromNode($rootNode, $query, $query->loadingDepth)
                : $this->performSearch($rootNode, $query),
        );
    }

    private function performSearch(Node $rootNode, GetTreeQuery $query): TreeNode
    {
        $baseNodeTypeFilter = NodeTypeFilter::fromFilterString(
            $query->baseNodeTypeFilter,
            $this->nodeTypeConstraintFactory,
            $this->nodeTypeManager,
        );
        $leafNodeTypeFilter = NodeTypeFilter::fromFilterString(
            $query->leafNodeTypeFilter,
            $this->nodeTypeConstraintFactory,
            $this->nodeTypeManager,
        );

        $matchingNodes = $this->nodeSearchService->search(
            $query->searchTerm,
            $leafNodeTypeFilter,
            $rootNode
        );

        $treeNodeBuildersByNodeAggregateIdentifier = [
            (string) $rootNode->getNodeAggregateIdentifier() =>
                $rootTreeNodeBuilder = $this->createTreeNodeBuilderFromNode($rootNode)
        ];

        foreach ($matchingNodes as $matchingNode) {
            /** @var Node $matchingNode */
            if (!$baseNodeTypeFilter->isSatisfiedByNode($matchingNode)) {
                //
                // Our matching node (somehow) doesn't match the base node type
                // filter.
                //
                // In this case, we don't traverse up its ancestry and drop it
                // from our result set.
                //
                break;
            }

            $treeNodeBuilder = $treeNodeBuildersByNodeAggregateIdentifier[(string) $matchingNode->getNodeAggregateIdentifier()] =
                $this->createTreeNodeBuilderFromNode($matchingNode);
            $treeNodeBuilder->setIsMatchedByFilter(true);

            $subject = $matchingNode;
            do {
                /** @var null|Node $parentNode */
                $parentNode = $subject->getParent();
                if (!$parentNode || !$baseNodeTypeFilter->isSatisfiedByNode($parentNode)) {
                    //
                    // We're either at a dead-end in the hierarchy (meaning
                    // that our matched node is an orphaned node or the
                    // descendant of an orphaned node) or some ancestor of our
                    // matched node doesn't match the base node type filter.
                    //
                    // In this case, we abandon the entire branch.
                    //
                    break;
                }

                $parentTreeNodeBuilder =
                    $treeNodeBuildersByNodeAggregateIdentifier[(string) $parentNode->getNodeAggregateIdentifier()]
                    ??= $this->createTreeNodeBuilderFromNode($parentNode);
                $parentTreeNodeBuilder->addChild($treeNodeBuilder);

                $subject = $parentNode;
                $treeNodeBuilder = $parentTreeNodeBuilder;
            } while (
                !$subject->getNodeAggregateIdentifier()
                    ->equals($rootNode->getNodeAggregateIdentifier())
            );
        }

        return $rootTreeNodeBuilder->build();
    }

    private function createTreeNodeBuilderFromNode(Node $node): TreeNodeBuilder
    {
        return new TreeNodeBuilder(
            nodeAggregateIdentifier: $node->getNodeAggregateIdentifier(),
            uri: new Uri('node://' . $node->getNodeAggregateIdentifier()),
            icon: $node->getNodeType()->getConfiguration('ui.icon'),
            label: $node->getLabel(),
            nodeTypeLabel: $node->getNodeType()->getLabel(),
            isMatchedByFilter: false,
            isDisabled: $node->isHidden(),
            isHiddenInMenu: $node->isHiddenInIndex(),
            hasScheduledDisabledState:
                $node->getHiddenBeforeDateTime() !== null
                || $node->getHiddenAfterDateTime() !== null,
            hasUnloadedChildren: false,
            nodeTypeNames: iterator_to_array(
                $this->getAllNonAbstractSuperTypesOf($node->getNodeType()),
                false
            ),
            children: [],
        );
    }

    private function createTreeNodeFromNode(Node $node, GetTreeQuery $query, int $remainingDepth): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $node->getNodeAggregateIdentifier(),
            uri: new Uri('node://' . $node->getNodeAggregateIdentifier()),
            icon: $node->getNodeType()->getConfiguration('ui.icon'),
            label: $node->getLabel(),
            nodeTypeLabel: $node->getNodeType()->getLabel(),
            isMatchedByFilter: true,
            isDisabled: $node->isHidden(),
            isHiddenInMenu: $node->isHiddenInIndex(),
            hasScheduledDisabledState:
                $node->getHiddenBeforeDateTime() !== null
                || $node->getHiddenAfterDateTime() !== null,
            hasUnloadedChildren:
                $remainingDepth === 0
                && $node->getNumberOfChildNodes($query->baseNodeTypeFilter) > 0,
            nodeTypeNames: iterator_to_array(
                $this->getAllNonAbstractSuperTypesOf($node->getNodeType()),
                false
            ),
            children: $this->createTreeNodesFromChildrenOfNode($node, $query, $remainingDepth),
        );
    }

    private function createTreeNodesFromChildrenOfNode(Node $node, GetTreeQuery $query, int $remainingDepth): TreeNodes
    {
        if ($remainingDepth === 0) {
            return new TreeNodes();
        }

        $items = [];

        foreach ($node->getChildNodes($query->baseNodeTypeFilter) as $childNode) {
            /** @var Node $childNode */
            $items[] = $this->createTreeNodeFromNode($childNode, $query, $remainingDepth - 1);
        }

        return new TreeNodes(...$items);
    }

    /**
     * @return \Traversable<int,NodeTypeName>
     */
    private function getAllNonAbstractSuperTypesOf(NodeType $nodeType): \Traversable
    {
        if (!$nodeType->isAbstract()) {
            yield NodeTypeName::fromString($nodeType->getName());
        }

        foreach ($nodeType->getDeclaredSuperTypes() as $superType) {
            yield from $this->getAllNonAbstractSuperTypesOf($superType);
        }
    }
}
