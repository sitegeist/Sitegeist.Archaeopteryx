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

use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeTypeFilterOptionsQuery
{
    public function __construct(
        public readonly string $baseNodeTypeFilter,
    ) {
    }

    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        isset($array['baseNodeTypeFilter'])
            or throw new \Exception('Base node type filter must be set');
        is_string($array['baseNodeTypeFilter'])
            or throw new \Exception('Base node type filter must be a string');

        return new self(
            baseNodeTypeFilter: $array['baseNodeTypeFilter'],
        );
    }
}
