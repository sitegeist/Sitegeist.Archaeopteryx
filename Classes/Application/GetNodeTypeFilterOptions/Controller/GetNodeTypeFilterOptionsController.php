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
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ControllerInterface;
use Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQuery;
use Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions\GetNodeTypeFilterOptionsQueryHandler;

#[Flow\Scope("singleton")]
final class GetNodeTypeFilterOptionsController implements ControllerInterface
{
    #[Flow\Inject]
    protected GetNodeTypeFilterOptionsQueryHandler $queryHandler;

    public function processRequest(ActionRequest $request, ActionResponse $response)
    {
        $request->setDispatched(true);

        $query = $request->getArguments();
        $query = GetNodeTypeFilterOptionsQuery::fromArray($query);

        $queryResult = $this->queryHandler->handle($query);

        $response->setContentType('application/json');
        $response->setContent(json_encode([
            'success' => $queryResult
        ], JSON_THROW_ON_ERROR));
    }
}
