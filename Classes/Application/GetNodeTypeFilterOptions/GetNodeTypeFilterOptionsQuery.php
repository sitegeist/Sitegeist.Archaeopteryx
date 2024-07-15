<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions;

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeTypeFilterOptionsQuery
{
    public function __construct(
        public readonly ContentRepositoryId $contentRepositoryId,
        public readonly string $baseNodeTypeFilter,
    ) {
    }

    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        isset($array['contentRepositoryId'])
            or throw new \InvalidArgumentException('Content Repository Id must be set');
        is_string($array['contentRepositoryId'])
            or throw new \InvalidArgumentException('Content Repository Id must be a string');

        isset($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be set');
        is_string($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be a string');

        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($array['contentRepositoryId']),
            baseNodeTypeFilter: $array['baseNodeTypeFilter'],
        );
    }
}
