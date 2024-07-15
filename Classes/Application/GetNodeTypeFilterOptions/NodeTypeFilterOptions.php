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

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilterOptions implements \JsonSerializable
{
    /** @var NodeTypeFilterOption[] */
    private readonly array $items;

    public function __construct(NodeTypeFilterOption ...$items)
    {
        $this->items = array_values($items);
    }

    /**
     * @param NodeType[] $nodeTypes
     */
    public static function fromNodeTypes(array $nodeTypes): self
    {
        $items = [];

        foreach ($nodeTypes as $nodeType) {
            if (!$nodeType->isAbstract()) {
                $items[] = NodeTypeFilterOption::fromNodeType($nodeType);
            }
        }

        return new self(...$items);
    }

    /**
     * @param array<string,array<mixed>> $presets
     */
    public static function fromNodeTreePresetsConfiguration(array $presets): self
    {
        $items = [];

        foreach ($presets as $presetName => $preset) {
            if ($presetName === 'default') {
                continue;
            }

            $items[] = NodeTypeFilterOption::fromNodeTreePresetConfiguration($preset);
        }

        return new self(...$items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }
}
