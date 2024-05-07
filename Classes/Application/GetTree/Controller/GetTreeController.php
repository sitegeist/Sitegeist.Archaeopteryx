<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetTree\Controller;

use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\GetTree\GetTreeQuery;
use Sitegeist\Archaeopteryx\Application\GetTree\GetTreeQueryHandler;
use Sitegeist\Archaeopteryx\Application\GetTree\StartingPointWasNotFound;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryController;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetTreeController extends QueryController
{
    #[Flow\Inject]
    protected GetTreeQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        try {
            $query = GetTreeQuery::fromArray($arguments);
            $queryResult = $this->queryHandler->handle($query);

            return QueryResponse::success($queryResult);
        } catch (StartingPointWasNotFound $e) {
            return QueryResponse::clientError($e);
        }
    }
}
