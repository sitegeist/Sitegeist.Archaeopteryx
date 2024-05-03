<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Infrastructure\ContentRepository;

use Neos\ContentRepository\Domain\Factory\NodeFactory;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\NodeSearchServiceInterface;
use Neos\Neos\Domain\Service\NodeSearchService as NeosNodeSearchService;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class NodeSearchService
{
    #[Flow\Inject]
    protected NodeSearchServiceInterface $nodeSearchService;

    #[Flow\Inject]
    protected NodeDataRepository $nodeDataRepository;

    #[Flow\Inject]
    protected NodeFactory $nodeFactory;

    /**
     * @return \Traversable<int,Node>
     */
    public function search(
        string $searchTerm,
        NodeTypeFilter $nodeTypeFilter,
        Node $rootNode,
    ): \Traversable {
        /** @var NeosNodeSearchService $nodeSearchService */
        $nodeSearchService = $this->nodeSearchService;
        $searchTerm = trim($searchTerm);
        $context = $rootNode->getContext();

        if ($searchTerm) {
            /** @var Node[] $result */
            $result = $nodeSearchService->findByProperties(
                $searchTerm,
                $nodeTypeFilter->allowedNodeTypeNames,
                $context,
                $rootNode
            );

            yield from $result;
        } else {
            //
            // This algorithm has been copied from the UI core, which uses the
            // NodeDataRepository as well (which it visibly regrets doing).
            //
            // Everything is going to be better in Neos 9.0.
            //
            $nodeDataRecords = $this->nodeDataRepository
                ->findByParentAndNodeTypeRecursively(
                    $rootNode->getPath(),
                    implode(',', $nodeTypeFilter->allowedNodeTypeNames),
                    $context->getWorkspace(),
                    $context->getDimensions()
                );
            foreach ($nodeDataRecords as $nodeData) {
                $matchedNode = $this->nodeFactory->createFromNodeData($nodeData, $context);
                if ($matchedNode !== null) {
                    /** @var Node $matchedNode */
                    yield $matchedNode;
                }
            }
        }
    }
}
