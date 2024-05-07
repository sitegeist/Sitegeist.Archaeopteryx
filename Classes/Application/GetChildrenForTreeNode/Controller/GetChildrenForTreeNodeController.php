<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetChildrenForTreeNode\Controller;

use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\GetChildrenForTreeNode\GetChildrenForTreeNodeQuery;
use Sitegeist\Archaeopteryx\Application\GetChildrenForTreeNode\GetChildrenForTreeNodeQueryHandler;
use Sitegeist\Archaeopteryx\Application\Shared\NodeWasNotFound;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryController;
use Sitegeist\Archaeopteryx\Framework\MVC\QueryResponse;

#[Flow\Scope("singleton")]
final class GetChildrenForTreeNodeController extends QueryController
{
    #[Flow\Inject]
    protected GetChildrenForTreeNodeQueryHandler $queryHandler;

    public function processQuery(array $arguments): QueryResponse
    {
        try {
            $query = GetChildrenForTreeNodeQuery::fromArray($arguments);
            $queryResult = $this->queryHandler->handle($query);

            return QueryResponse::success($queryResult);
        } catch (NodeWasNotFound $e) {
            return QueryResponse::clientError($e);
        }
    }
}
