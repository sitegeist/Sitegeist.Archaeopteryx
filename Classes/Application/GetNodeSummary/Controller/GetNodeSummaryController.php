<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetNodeSummary\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ControllerInterface;
use Sitegeist\Archaeopteryx\Application\GetNodeSummary\GetNodeSummaryQuery;
use Sitegeist\Archaeopteryx\Application\GetNodeSummary\GetNodeSummaryQueryHandler;

#[Flow\Scope("singleton")]
final class GetNodeSummaryController implements ControllerInterface
{
    #[Flow\Inject]
    protected GetNodeSummaryQueryHandler $queryHandler;

    public function processRequest(ActionRequest $request, ActionResponse $response)
    {
        $request->setDispatched(true);

        $query = $request->getArguments();
        $query = GetNodeSummaryQuery::fromArray($query);

        $queryResult = $this->queryHandler->handle($query);

        $response->setContentType('application/json');
        $response->setContent(json_encode([
            'success' => $queryResult
        ], JSON_THROW_ON_ERROR));
    }
}
