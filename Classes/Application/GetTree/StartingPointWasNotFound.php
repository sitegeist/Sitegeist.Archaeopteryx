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

use Neos\ContentRepository\Domain\ContentSubgraph\NodePath;
use Neos\ContentRepository\Domain\Service\Context as ContentContext;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class StartingPointWasNotFound extends \Exception
{
    private function __construct(string $message, int $code)
    {
        parent::__construct($message, $code);
    }

    public static function becauseNodeWithGivenPathDoesNotExistInContext(
        NodePath $nodePath,
        ContentContext $contentContext,
    ): self {
        return new self(
            sprintf(
                'The starting point at path "%s" does not exist in context: %s',
                (string) $nodePath,
                json_encode($contentContext->getProperties(), JSON_PRETTY_PRINT),
            ),
            1715082893
        );
    }
}
