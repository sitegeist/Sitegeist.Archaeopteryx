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

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilterOption implements \JsonSerializable
{
    public function __construct(
        public readonly NodeTypeName $value,
        public readonly string $icon,
        public readonly string $label,
    ) {
    }

    public static function fromNodeType(NodeType $nodeType): self
    {
        return new self(
            value: NodeTypeName::fromString($nodeType->getName()),
            icon: $nodeType->getConfiguration('ui.icon'),
            label: $nodeType->getConfiguration('ui.label'),
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
