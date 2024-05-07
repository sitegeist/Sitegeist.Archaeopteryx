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

use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNodes implements \JsonSerializable
{
    /** @var TreeNode[] */
    private readonly array $items;

    public function __construct(TreeNode ...$items)
    {
        $this->items = array_values($items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }
}
