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
use Neos\Flow\Annotations as Flow;

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
        public readonly string $leafNodeTypeFilter,
        public readonly string $searchTerm,
    ) {
    }

    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        isset($array['workspaceName'])
            or throw new \Exception('Workspace name must be set');
        is_string($array['workspaceName'])
            or throw new \Exception('Workspace name must be a string');

        isset($array['dimensionValues'])
            or throw new \Exception('Dimension values must be set');
        is_array($array['dimensionValues'])
            or throw new \Exception('Dimension values must be an array');

        isset($array['startingPoint'])
            or throw new \Exception('Starting point must be set');
        is_string($array['startingPoint'])
            or throw new \Exception('Starting point must be a string');

        isset($array['loadingDepth'])
            or throw new \Exception('Loading depth must be set');
        if (is_string($array['loadingDepth'])) {
            $array['loadingDepth'] = (int) $array['loadingDepth'];
        }
        is_int($array['loadingDepth'])
            or throw new \Exception('Loading depth must be an integer');

        !isset($array['baseNodeTypeFilter']) or is_string($array['baseNodeTypeFilter'])
            or throw new \Exception('Base node type filter must be a string');

        !isset($array['leafNodeTypeFilter']) or is_string($array['leafNodeTypeFilter'])
            or throw new \Exception('Leaf node type filter must be a string');

        !isset($array['searchTerm']) or is_string($array['searchTerm'])
            or throw new \Exception('Search term must be a string');

        return new self(
            workspaceName: $array['workspaceName'],
            dimensionValues: $array['dimensionValues'],
            startingPoint: NodePath::fromString($array['startingPoint']),
            loadingDepth: $array['loadingDepth'],
            baseNodeTypeFilter: $array['baseNodeTypeFilter'] ?? '',
            leafNodeTypeFilter: $array['leafNodeTypeFilter'] ?? '',
            searchTerm: $array['searchTerm'] ?? '',
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
