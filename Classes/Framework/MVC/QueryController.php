<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Framework\MVC;

use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ControllerInterface;

abstract class QueryController implements ControllerInterface
{
    public function processRequest(ActionRequest $request, ActionResponse $response): void
    {
        $request->setDispatched(true);
        $response->setContentType('application/json');

        try {
            $queryResponse = $this->processQuery($request->getArguments());
        } catch (\InvalidArgumentException $e) {
            $queryResponse = QueryResponse::clientError($e);
        } catch (\Exception $e) {
            $queryResponse = QueryResponse::serverError($e);
        }

        $queryResponse->applyToActionResponse($response);
    }

    /**
     * @param array<mixed> $arguments
     */
    abstract public function processQuery(array $arguments): QueryResponse;
}
