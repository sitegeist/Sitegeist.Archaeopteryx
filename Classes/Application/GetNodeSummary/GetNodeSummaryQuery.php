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

use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeSummaryQuery
{
    /**
     * @param array<string,array<int,string>> $dimensionValues
     */
    public function __construct(
        public readonly string $workspaceName,
        public readonly array $dimensionValues,
        public readonly NodeAggregateIdentifier $nodeId,
    ) {
    }

    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        isset($array['workspaceName'])
            or throw new \InvalidArgumentException('Workspace name must be set');
        is_string($array['workspaceName'])
            or throw new \InvalidArgumentException('Workspace name must be a string');

        isset($array['nodeId'])
            or throw new \InvalidArgumentException('Node id must be set');
        is_string($array['nodeId'])
            or throw new \InvalidArgumentException('Node id must be a string');

        return new self(
            workspaceName: $array['workspaceName'],
            dimensionValues: $array['dimensionValues'] ?? [],
            nodeId: NodeAggregateIdentifier::fromString($array['nodeId']),
        );
    }

    /**
     * @return array<string,string>
     */
    public function getTargetDimensionValues(): array
    {
        $result = [];

        foreach ($this->dimensionValues as $dimensionName => $fallbackChain) {
            $result[$dimensionName] = $fallbackChain[0] ?? '';
        }

        return $result;
    }
}
