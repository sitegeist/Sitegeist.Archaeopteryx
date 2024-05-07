<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions\Controller;

use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQuery;
use Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQueryHandler;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryController;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetNodeTypeFilterOptionsController extends QueryController
{
    #[Flow\Inject]
    protected GetNodeTypeFilterOptionsQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        $query = GetNodeTypeFilterOptionsQuery::fromArray($arguments);
        $queryResult = $this->queryHandler->handle($query);

        return QueryResponse::success($queryResult);
    }
}
