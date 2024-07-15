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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\LinkableNodeSpecification;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeSearchSpecification;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeService;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetTreeQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    public function handle(GetTreeQuery $query): GetTreeQueryResult
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );

        $rootNode = $nodeService->findNodeByAbsoluteNodePath($query->startingPoint);
        if ($rootNode === null) {
            throw StartingPointWasNotFound::becauseNodeWithGivenPathDoesNotExistInCurrentSubgraph(
                nodePath: $query->startingPoint,
                subgraph: $nodeService->subgraph,
            );
        }

        return new GetTreeQueryResult(
            root: empty($query->searchTerm) && empty($query->narrowNodeTypeFilter)
                ? $this->loadTree($nodeService, $rootNode, $query, $query->loadingDepth)
                : $this->performSearch($nodeService, $rootNode, $query),
        );
    }

    private function performSearch(
        NodeService $nodeService,
        Node $rootNode,
        GetTreeQuery $query,
    ): TreeNode {
        $baseNodeTypeFilter = $nodeService->createNodeTypeFilterFromFilterString(
            filterString: $query->baseNodeTypeFilter,
        );
        $narrowNodeTypeFilter = $nodeService->createNodeTypeFilterFromFilterString(
            filterString: $query->narrowNodeTypeFilter,
        );

        $matchingNodes = $nodeService->search(
            rootNode: $rootNode,
            searchTerm: $query->searchTerm,
            nodeTypeFilter: $narrowNodeTypeFilter,
        );

        $treeBuilder = $nodeService->createTreeBuilderForRootNode(
            rootNode: $rootNode,
            nodeSearchSpecification: new NodeSearchSpecification(
                baseNodeTypeFilter: $baseNodeTypeFilter,
                narrowNodeTypeFilter: $narrowNodeTypeFilter,
                searchTerm: $query->searchTerm,
                nodeService: $nodeService,
            ),
            linkableNodeSpecification: new LinkableNodeSpecification(
                linkableNodeTypes: $nodeService->createNodeTypeFilterFromNodeTypeNames(
                    nodeTypeNames: $query->linkableNodeTypes,
                ),
            ),
        );

        foreach ($matchingNodes as $matchingNode) {
            $treeBuilder->addNodeWithAncestors(
                node: $matchingNode,
                ancestors: $nodeService->findAncestorNodes($matchingNode),
            );
        }

        return $treeBuilder->build();
    }

    private function loadTree(
        NodeService $nodeService,
        Node $node,
        GetTreeQuery $query,
        int $remainingDepth,
    ): TreeNode {
        $baseNodeTypeFilter = $nodeService->createNodeTypeFilterFromFilterString(
            filterString: $query->baseNodeTypeFilter,
        );

        $treeBuilder =  $nodeService->createTreeBuilderForRootNode(
            rootNode: $node,
            nodeSearchSpecification: new NodeSearchSpecification(
                baseNodeTypeFilter: $baseNodeTypeFilter,
                narrowNodeTypeFilter: null,
                searchTerm: null,
                nodeService: $nodeService,
            ),
            linkableNodeSpecification: new LinkableNodeSpecification(
                linkableNodeTypes: $nodeService->createNodeTypeFilterFromNodeTypeNames(
                    nodeTypeNames: $query->linkableNodeTypes,
                ),
            ),
        );

        $treeBuilder->addNodeWithDescendants($node, $remainingDepth);

        if ($query->selectedNodeId) {
            /** @var Node|null $selectedNode */
            $selectedNode = $nodeService->findNodeById($query->selectedNodeId);
            if ($selectedNode) {
                $treeBuilder->addNodeWithSiblingsAndAncestors($selectedNode);
            }
        }

        return $treeBuilder->build();
    }
}
