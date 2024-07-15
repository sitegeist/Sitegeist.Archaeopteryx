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

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodes;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeService;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetChildrenForTreeNodeQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    public function handle(GetChildrenForTreeNodeQuery $query): GetChildrenForTreeNodeQueryResult
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );

        $node = $nodeService->requireNodeById($query->treeNodeId);

        return new GetChildrenForTreeNodeQueryResult(
            children: $this->createTreeNodesFromChildrenOfNode($nodeService, $node, $query),
        );
    }

    private function createTreeNodesFromChildrenOfNode(NodeService $nodeService, Node $node, GetChildrenForTreeNodeQuery $query): TreeNodes
    {
        $linkableNodeTypesFilter = $nodeService->createNodeTypeFilterFromNodeTypeNames(
            nodeTypeNames: $query->linkableNodeTypes
        );

        $items = [];
        $nodeTypeCriteria = NodeTypeCriteria::fromFilterString($query->nodeTypeFilter);

        foreach ($nodeService->findChildNodes($node, $nodeTypeCriteria) as $childNode) {
            /** @var Node $childNode */
            $items[] = $nodeService->createTreeNodeBuilderForNode($childNode)
                ->setIsMatchedByFilter(true)
                ->setIsLinkable($linkableNodeTypesFilter->isSatisfiedByNode($childNode))
                ->setHasUnloadedChildren($nodeService->getNumberOfChildNodes($childNode, $nodeTypeCriteria) > 0)
                ->build();
        }

        return new TreeNodes(...$items);
    }
}
