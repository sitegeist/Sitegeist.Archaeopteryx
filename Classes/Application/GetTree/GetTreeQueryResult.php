<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetTree;

use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetTreeQueryResult implements \JsonSerializable
{
    public function __construct(
        public readonly TreeNode $root,
    ) {
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
