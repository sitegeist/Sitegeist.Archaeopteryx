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

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilterOption implements \JsonSerializable
{
    public function __construct(
        public readonly string $value,
        public readonly string $icon,
        public readonly string $label,
    ) {
    }

    public static function fromNodeType(NodeType $nodeType): self
    {
        return new self(
            value: $nodeType->getName(),
            icon: $nodeType->getConfiguration('ui.icon') ?: 'question',
            label: $nodeType->getConfiguration('ui.label') ?: $nodeType->getName(),
        );
    }

    /**
     * @param array<mixed> $preset
     */
    public static function fromNodeTreePresetConfiguration(array $preset): self
    {
        return new self(
            value: isset($preset['baseNodeType']) && is_string($preset['baseNodeType'])
                ? $preset['baseNodeType']
                : '',
            icon: isset($preset['ui']['icon']) && is_string($preset['ui']['icon'])
                ? $preset['ui']['icon']
                : 'filter',
            label: isset($preset['ui']['label']) && is_string($preset['ui']['label'])
                ? $preset['ui']['label']
                : 'N/A',
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
