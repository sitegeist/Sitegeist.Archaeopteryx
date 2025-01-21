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

use Neos\ContentRepository\Domain\ContentSubgraph\NodePath;
use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\Shared\NodeTypeNames;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetTreeQuery
{
    /**
     * @param array<string,array<int,string>> $dimensionValues
     */
    public function __construct(
        public readonly string $workspaceName,
        public readonly array $dimensionValues,
        public readonly NodePath $startingPoint,
        public readonly int $loadingDepth,
        public readonly string $baseNodeTypeFilter,
        public readonly NodeTypeNames $linkableNodeTypes,
        public readonly string $narrowNodeTypeFilter,
        public readonly string $searchTerm,
        public readonly ?NodeAggregateIdentifier $selectedNodeId,
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

        isset($array['startingPoint'])
            or throw new \InvalidArgumentException('Starting point must be set');
        is_string($array['startingPoint'])
            or throw new \InvalidArgumentException('Starting point must be a string');

        isset($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be set');
        if (is_string($array['loadingDepth'])) {
            $array['loadingDepth'] = (int) $array['loadingDepth'];
        }
        is_int($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be an integer');

        !isset($array['baseNodeTypeFilter']) or is_string($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be a string');

        !isset($array['linkableNodeTypes']) or is_array($array['linkableNodeTypes'])
            or throw new \InvalidArgumentException('Linkable node types must be an array');

        !isset($array['narrowNodeTypeFilter']) or is_string($array['narrowNodeTypeFilter'])
            or throw new \InvalidArgumentException('Narrow node type filter must be a string');

        !isset($array['searchTerm']) or is_string($array['searchTerm'])
            or throw new \InvalidArgumentException('Search term must be a string');

        !isset($array['selectedNodeId']) or is_string($array['selectedNodeId'])
            or throw new \InvalidArgumentException('Selected node id term must be a string');

        return new self(
            workspaceName: $array['workspaceName'],
            dimensionValues: $array['dimensionValues'] ?? [],
            startingPoint: NodePath::fromString($array['startingPoint']),
            loadingDepth: $array['loadingDepth'],
            baseNodeTypeFilter: $array['baseNodeTypeFilter'] ?? '',
            linkableNodeTypes: NodeTypeNames::fromArray($array['linkableNodeTypes'] ?? []),
            narrowNodeTypeFilter: $array['narrowNodeTypeFilter'] ?? '',
            searchTerm: $array['searchTerm'] ?? '',
            selectedNodeId: isset($array['selectedNodeId'])
                ? NodeAggregateIdentifier::fromString($array['selectedNodeId'])
                : null,
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
