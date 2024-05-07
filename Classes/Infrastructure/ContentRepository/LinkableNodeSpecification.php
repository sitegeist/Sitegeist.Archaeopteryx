<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Infrastructure\ContentRepository;

use Neos\ContentRepository\Domain\Model\Node;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class LinkableNodeSpecification
{
    public function __construct(
        public readonly NodeTypeFilter $linkableNodeTypes,
    ) {
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        return $this->linkableNodeTypes->isSatisfiedByNode($node);
    }
}
