<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Infrastructure\ESCR;

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class NodeTypeServiceFactory
{
    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    public function create(ContentRepositoryId $contentRepositoryId): NodeTypeService
    {
        return new NodeTypeService(
            contentRepository: $this->contentRepositoryRegistry
                ->get($contentRepositoryId),
        );
    }
}
