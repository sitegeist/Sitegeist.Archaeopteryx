<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\GetNodeTypeFilterOptions;

use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeTypeService;
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeTypeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetNodeTypeFilterOptionsQueryHandler
{
    /** @var array<string,array<mixed>> */
    #[Flow\InjectConfiguration(package: 'Neos.Neos', path: 'userInterface.navigateComponent.nodeTree.presets')]
    protected array $nodeTreePresets;

    #[Flow\Inject]
    protected NodeTypeServiceFactory $nodeTypeServiceFactory;

    public function handle(GetNodeTypeFilterOptionsQuery $query): GetNodeTypeFilterOptionsQueryResult
    {
        $nodeTypeService = $this->nodeTypeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
        );

        return new GetNodeTypeFilterOptionsQueryResult(
            options: $this->thereAreNodeTreePresetsOtherThanDefault()
                ? $this->createNodeTypeFilterOptionsForNodeTreePresets()
                : $this->createNodeTypeFilterOptionsForNodeTypes($nodeTypeService, $query->baseNodeTypeFilter),
        );
    }

    private function thereAreNodeTreePresetsOtherThanDefault(): bool
    {
        $defaultExists = isset($this->nodeTreePresets['default']);
        $numberOfPresets = count($this->nodeTreePresets);

        return ($defaultExists && $numberOfPresets > 1)
            || (!$defaultExists && $numberOfPresets > 0);
    }

    private function createNodeTypeFilterOptionsForNodeTreePresets(): NodeTypeFilterOptions
    {
        return NodeTypeFilterOptions::fromNodeTreePresetsConfiguration(
            $this->nodeTreePresets
        );
    }

    private function createNodeTypeFilterOptionsForNodeTypes(
        NodeTypeService $nodeTypeService,
        string $baseNodeTypeFilter
    ): NodeTypeFilterOptions {
        $nodeTypeFilter = $nodeTypeService->createNodeTypeFilterFromFilterString(
            $baseNodeTypeFilter,
        );

        $nodeTypes = [];
        foreach ($nodeTypeFilter->getAllowedNodeTypeNames() as $nodeTypeName) {
            $nodeTypes[] = $nodeTypeService->requireNodeTypeByName($nodeTypeName);
        }

        return NodeTypeFilterOptions::fromNodeTypes($nodeTypes);
    }
}
