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
use Sitegeist\Archaeopteryx\Infrastructure\ESCR\NodeTypeServiceFactory;
use Sitegeist\Archaeopteryx\Presentation\Option\Options;
use Sitegeist\Archaeopteryx\Presentation\Option\OptionsFactory;

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

    #[Flow\Inject]
    protected OptionsFactory $optionsFactory;

    public function handle(GetNodeTypeFilterOptionsQuery $query): GetNodeTypeFilterOptionsQueryResult
    {
        return new GetNodeTypeFilterOptionsQueryResult(
            options: $this->thereAreNodeTreePresetsOtherThanDefault()
                ? $this->renderOptionsForNodeTreePresets()
                : $this->renderOptionsForNodeTypes($query),
        );
    }

    private function thereAreNodeTreePresetsOtherThanDefault(): bool
    {
        $defaultExists = isset($this->nodeTreePresets['default']);
        $numberOfPresets = count($this->nodeTreePresets);

        return ($defaultExists && $numberOfPresets > 1)
            || (!$defaultExists && $numberOfPresets > 0);
    }

    private function renderOptionsForNodeTreePresets(): Options
    {
        return $this->optionsFactory->forNodeTreePresets($this->nodeTreePresets);
    }

    private function renderOptionsForNodeTypes(GetNodeTypeFilterOptionsQuery $query): Options
    {
        $nodeTypeService = $this->nodeTypeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
        );

        return $this->optionsFactory->forNodeTypes(
            ...$nodeTypeService->getAllNodeTypesMatching($query->baseNodeTypeFilter)
        );
    }
}
