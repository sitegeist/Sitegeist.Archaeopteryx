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
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContextFactory;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodeBuilder;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodes;
use Sitegeist\Archaeopteryx\Infrastructure\ContentRepository\NodeTypeFilter;

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
        $linkableNodeTypesFilter = NodeTypeFilter::fromNodeTypeNames(
            nodeTypeNames: $query->linkableNodeTypes,
            nodeTypeManager: $this->nodeTypeManager
        );

        $items = [];

        foreach ($node->getChildNodes($query->nodeTypeFilter) as $childNode) {
            /** @var Node $childNode */
            $items[] = TreeNodeBuilder::forNode($childNode)
                ->setIsMatchedByFilter(true)
                ->setIsLinkable($linkableNodeTypesFilter->isSatisfiedByNode($childNode))
                ->setHasUnloadedChildren($childNode->getNumberOfChildNodes($query->nodeTypeFilter) > 0)
                ->build();
        }

        return new TreeNodes(...$items);
    }
}
