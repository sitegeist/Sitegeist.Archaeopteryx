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
use Neos\ContentRepository\Domain\Service\Context as ContentContext;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeWasNotFound extends \Exception
{
    private function __construct(string $message, int $code)
    {
        parent::__construct($message, $code);
    }

    public static function becauseNodeWithGivenIdentifierDoesNotExistInContext(
        NodeAggregateIdentifier $nodeAggregateIdentifier,
        ContentContext $contentContext,
    ): self {
        return new self(
            sprintf(
                'A node with the identifier "%s" does not exist in context: %s',
                (string) $nodeAggregateIdentifier,
                json_encode($contentContext->getProperties(), JSON_PRETTY_PRINT),
            ),
            1715082627
        );
    }
}
