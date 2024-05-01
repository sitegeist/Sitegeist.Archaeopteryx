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

use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetChildrenForTreeNodeQuery
{
    /**
     * @param array<string,array<int,string>> $dimensionValues
     */
    public function __construct(
        public readonly string $workspaceName,
        public readonly array $dimensionValues,
        public readonly NodeAggregateIdentifier $treeNodeId,
        public readonly string $nodeTypeFilter,
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

        isset($array['treeNodeId'])
            or throw new \Exception('Tree node id must be set');
        is_string($array['treeNodeId'])
            or throw new \Exception('Tree node id must be a string');

        !isset($array['nodeTypeFilter']) or is_string($array['nodeTypeFilter'])
            or throw new \Exception('Node type filter must be a string');

        return new self(
            workspaceName: $array['workspaceName'],
            dimensionValues: $array['dimensionValues'],
            treeNodeId: NodeAggregateIdentifier::fromString($array['treeNodeId']),
            nodeTypeFilter: $array['nodeTypeFilter'] ?? '',
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
