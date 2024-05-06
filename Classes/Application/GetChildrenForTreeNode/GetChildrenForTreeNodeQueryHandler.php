<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetChildrenForTreeNode;

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContextFactory;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodes;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetChildrenForTreeNodeQueryHandler
{
    #[Flow\Inject]
    protected ContentContextFactory $contentContextFactory;

    #[Flow\Inject]
    protected NodeTypeManager $nodeTypeManager;

    public function handle(GetChildrenForTreeNodeQuery $query): GetChildrenForTreeNodeQueryResult
    {
        $contentContext = $this->contentContextFactory->create([
            'workspaceName' => $query->workspaceName,
            'dimensions' => $query->dimensionValues,
            'targetDimensions' => $query->getTargetDimensionValues(),
            'invisibleContentShown' => true,
            'removedContentShown' => false,
            'inaccessibleContentShown' => true
        ]);

        $node = $contentContext->getNodeByIdentifier((string) $query->treeNodeId);
        if (!$node instanceof Node) {
            throw new \Exception('Forget it!');
        }

        return new GetChildrenForTreeNodeQueryResult(
            children: $this->createTreeNodesFromChildrenOfNode($node, $query),
        );
    }

    private function createTreeNodesFromChildrenOfNode(Node $node, GetChildrenForTreeNodeQuery $query): TreeNodes
    {
        $items = [];

        foreach ($node->getChildNodes($query->nodeTypeFilter) as $childNode) {
            /** @var Node $childNode */
            $items[] = $this->createTreeNodeFromNode($childNode, $query);
        }

        return new TreeNodes(...$items);
    }

    private function createTreeNodeFromNode(Node $node, GetChildrenForTreeNodeQuery $query): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $node->getNodeAggregateIdentifier(),
            icon: $node->getNodeType()->getConfiguration('ui.icon'),
            label: $node->getLabel(),
            nodeTypeLabel: $node->getNodeType()->getLabel(),
            isMatchedByFilter: true,
            isDisabled: $node->isHidden(),
            isHiddenInMenu: $node->isHiddenInIndex(),
            hasScheduledDisabledState:
                $node->getHiddenBeforeDateTime() !== null
                || $node->getHiddenAfterDateTime() !== null,
            hasUnloadedChildren: $node->getNumberOfChildNodes($query->nodeTypeFilter) > 0,
            nodeTypeNames: iterator_to_array(
                $this->getAllNonAbstractSuperTypesOf($node->getNodeType()),
                false
            ),
            children: new TreeNodes(),
        );
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
