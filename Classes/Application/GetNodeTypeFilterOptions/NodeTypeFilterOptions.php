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

use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
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
     * @param array<string,string|NodeTypeName> $nodeTypeNames
     */
    public static function fromNodeTypeNames(array $nodeTypeNames, NodeTypeManager $nodeTypeManager): self
    {
        $items = [];

        foreach ($nodeTypeNames as $nodeTypeName) {
            $nodeType = $nodeTypeManager->getNodeType((string) $nodeTypeName);
            $items[] = NodeTypeFilterOption::fromNodeType($nodeType);
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
