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
final class NodeTypeNames
{
    /** @var NodeTypeName[] */
    private readonly array $items;

    private function __construct(NodeTypeName ...$items)
    {
        $this->items = array_values($items);
    }

    /**
     * @param array<mixed> $array
     */
    public static function fromArray(array $array): self
    {
        $items = [];
        foreach ($array as $nodeTypeNameAsString) {
            is_string($nodeTypeNameAsString)
                or throw new \InvalidArgumentException('Node type name must be a string');

            $items[] = NodeTypeName::fromString($nodeTypeNameAsString);
        }

        return new self(...$items);
    }

    public function includesSuperTypeOf(NodeType $nodeType): bool
    {
        if (empty($this->items)) {
            return true;
        }

        foreach ($this->items as $item) {
            if ($nodeType->isOfType((string) $item)) {
                return true;
            }
        }

        return false;
    }
}
