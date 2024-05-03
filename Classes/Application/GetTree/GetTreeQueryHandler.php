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
use Neos\Neos\Domain\Service\NodeSearchService;
use Neos\Neos\Domain\Service\NodeSearchServiceInterface;
use Sitegeist\Archaeopteryx\Application\Shared\NodeTypeFilterOptions;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodeBuilder;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodes;

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
    protected NodeSearchServiceInterface $nodeSearchService;

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
            root: $tree = empty($query->searchTerm)
                ? $this->createTreeNodeFromNode($rootNode, $query, $query->loadingDepth)
                : $this->performSearch($rootNode, $query),
            nodeTypeFilterOptions: NodeTypeFilterOptions::fromTreeNode($tree, $this->nodeTypeManager),
        );
    }

    private function performSearch(Node $rootNode, GetTreeQuery $query): TreeNode
    {
        $allowedNodeTypeNames = iterator_to_array(
            $this->getAllowedNodeTypeNamesAccordingToNodeTypeFilter($query->nodeTypeFilter),
            false
        );
        /** @var NodeSearchService $nodeSearchService */
        $nodeSearchService = $this->nodeSearchService;
        $matchingNodes = $nodeSearchService->findByProperties(
            $query->searchTerm,
            $allowedNodeTypeNames,
            $rootNode->getContext(),
            $rootNode
        );

        $treeNodeBuildersByNodeAggregateIdentifier = [
            (string) $rootNode->getNodeAggregateIdentifier() =>
                $rootTreeNodeBuilder = $this->createTreeNodeBuilderFromNode($rootNode)
        ];

        foreach ($matchingNodes as $matchingNode) {
            /** @var Node $matchingNode */
            $treeNodeBuilder = $treeNodeBuildersByNodeAggregateIdentifier[(string) $matchingNode->getNodeAggregateIdentifier()] =
                $this->createTreeNodeBuilderFromNode($matchingNode);
            $treeNodeBuilder->setIsMatchedByFilter(true);

            $subject = $matchingNode;
            do {
                /** @var null|Node $parentNode */
                $parentNode = $subject->getParent();
                if (!$parentNode) {
                    throw new \Exception('What is this?');
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

    /**
     * @return \Traversable<int,string>
     */
    private function getAllowedNodeTypeNamesAccordingToNodeTypeFilter(string $nodeTypeFilter): \Traversable
    {
        $nodeTypeConstraints = $this->nodeTypeConstraintFactory->parseFilterString($nodeTypeFilter);

        foreach ($this->nodeTypeManager->getNodeTypes(false) as $nodeType) {
            $nodeTypeName = $nodeType->getName();
            if ($nodeTypeConstraints->matches(NodeTypeName::fromString($nodeTypeName))) {
                yield $nodeTypeName;
            }
        }
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
                && $node->getNumberOfChildNodes($query->nodeTypeFilter) > 0,
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

        foreach ($node->getChildNodes($query->nodeTypeFilter) as $childNode) {
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
