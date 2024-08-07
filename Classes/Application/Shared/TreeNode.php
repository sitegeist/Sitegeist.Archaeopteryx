<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\Shared;

use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNode implements \JsonSerializable
{
    public function __construct(
        public readonly NodeAggregateIdentifier $nodeAggregateIdentifier,
        public readonly string $icon,
        public readonly string $label,
        public readonly string $nodeTypeLabel,
        public readonly bool $isMatchedByFilter,
        public readonly bool $isLinkable,
        public readonly bool $isDisabled,
        public readonly bool $isHiddenInMenu,
        public readonly bool $hasScheduledDisabledState,
        public readonly bool $hasUnloadedChildren,
        public readonly TreeNodes $children
    ) {
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
