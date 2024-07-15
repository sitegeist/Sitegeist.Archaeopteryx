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

use Neos\ContentRepository\Core\Projection\ContentGraph\AbsoluteNodePath;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
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

    public static function becauseNodeWithGivenPathDoesNotExistInCurrentSubgraph(
        AbsoluteNodePath $nodePath,
        ContentSubgraphInterface $subgraph,
    ): self {
        return new self(
            sprintf(
                'The starting point at path "%s" does not exist in subgraph: %s',
                $nodePath->serializeToString(),
                json_encode([
                    'contentRepositoryId' => $subgraph->getContentRepositoryId(),
                    'workspaceName' => $subgraph->getWorkspaceName(),
                    'dimensionSpacePoint' => $subgraph->getDimensionSpacePoint(),
                ], JSON_PRETTY_PRINT),
            ),
            1715082893
        );
    }
}
