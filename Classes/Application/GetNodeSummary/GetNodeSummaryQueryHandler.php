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
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContextFactory;
use Sitegeist\Archaeopteryx\Application\Shared\NodeWasNotFound;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetNodeSummaryQueryHandler
{
    #[Flow\Inject]
    protected ContentContextFactory $contentContextFactory;

    #[Flow\Inject]
    protected NodeTypeManager $nodeTypeManager;

    public function handle(GetNodeSummaryQuery $query): GetNodeSummaryQueryResult
    {
        $contentContext = $this->contentContextFactory->create([
            'workspaceName' => $query->workspaceName,
            'dimensions' => $query->dimensionValues,
            'targetDimensions' => $query->getTargetDimensionValues(),
            'invisibleContentShown' => true,
            'removedContentShown' => false,
            'inaccessibleContentShown' => true
        ]);

        $node = $contentContext->getNodeByIdentifier((string) $query->nodeId);
        if (!$node instanceof Node) {
            throw NodeWasNotFound::becauseNodeWithGivenIdentifierDoesNotExistInContext(
                nodeAggregateIdentifier: $query->nodeId,
                contentContext: $contentContext,
            );
        }

        return new GetNodeSummaryQueryResult(
            icon: $node->getNodeType()->getConfiguration('ui.icon'),
            label: $node->getLabel(),
            uri: new Uri('node://' . $node->getNodeAggregateIdentifier()),
            breadcrumbs: $this->createBreadcrumbsForNode($node)
        );
    }

    private function createBreadcrumbsForNode(Node $node): Breadcrumbs
    {
        $items = [];

        while ($node) {
            /** @var Node $node */
            $items[] = $this->createBreadcrumbForNode($node);
            $node = $node->getParent();
        }

        $items = array_slice($items, 0, -2);
        $items = array_reverse($items);

        return new Breadcrumbs(...$items);
    }

    private function createBreadcrumbForNode(Node $node): Breadcrumb
    {
        return new Breadcrumb(
            icon: $node->getNodeType()->getConfiguration('ui.icon') ?? 'questionmark',
            label: $node->getLabel(),
        );
    }
}
