<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetNodeSummary;

use GuzzleHttp\Psr7\Uri;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeService;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetNodeSummaryQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    public function handle(GetNodeSummaryQuery $query): GetNodeSummaryQueryResult
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );

        $node = $nodeService->requireNodeById($query->nodeId);
        $nodeType = $nodeService->requireNodeTypeByName($node->nodeTypeName);

        return new GetNodeSummaryQueryResult(
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $nodeService->getLabelForNode($node),
            uri: new Uri('node://' . $node->aggregateId->value),
            breadcrumbs: $this->createBreadcrumbsForNode($nodeService, $node),
        );
    }

    private function createBreadcrumbsForNode(NodeService $nodeService, Node $node): Breadcrumbs
    {
        $items = [];

        while ($node) {
            /** @var Node $node */
            $items[] = $this->createBreadcrumbForNode($nodeService, $node);
            $node = $nodeService->findParentNode($node);
        }

        $items = array_slice($items, 0, -2);
        $items = array_reverse($items);

        return new Breadcrumbs(...$items);
    }

    private function createBreadcrumbForNode(NodeService $nodeService, Node $node): Breadcrumb
    {
        $nodeType = $nodeService->requireNodeTypeByName($node->nodeTypeName);

        return new Breadcrumb(
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $nodeService->getLabelForNode($node),
        );
    }
}
