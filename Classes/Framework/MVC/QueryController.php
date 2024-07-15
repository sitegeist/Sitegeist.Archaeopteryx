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
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;

abstract class QueryController implements ControllerInterface
{
    public function processRequest(ActionRequest $request, ActionResponse $response): void
    {
        $request->setDispatched(true);
        $response->setContentType('application/json');

        try {
            // @TODO: It should not be necessary to inject the contentRepositoryId
            // like this. For the time being, it's the only way though.
            $arguments = $request->getArguments();
            if (!isset($arguments['contentRepositoryId'])) {
                $siteDetectionResult = SiteDetectionResult::fromRequest($request->getHttpRequest());
                $arguments['contentRepositoryId'] = $siteDetectionResult->contentRepositoryId->value;
            }

            $queryResponse = $this->processQuery($arguments);
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
