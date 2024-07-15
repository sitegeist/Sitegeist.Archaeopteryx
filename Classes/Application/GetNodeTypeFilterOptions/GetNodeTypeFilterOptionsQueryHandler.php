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

use Neos\ContentRepository\Domain\NodeType\NodeTypeConstraintFactory;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Infrastructure\ContentRepository\NodeTypeFilter;

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
    protected NodeTypeManager $nodeTypeManager;

    #[Flow\Inject]
    protected NodeTypeConstraintFactory $nodeTypeConstraintFactory;

    public function handle(GetNodeTypeFilterOptionsQuery $query): GetNodeTypeFilterOptionsQueryResult
    {
        return new GetNodeTypeFilterOptionsQueryResult(
            options: $this->thereAreNodeTreePresetsOtherThanDefault()
                ? $this->createNodeTypeFilterOptionsForNodeTreePresets()
                : $this->createNodeTypeFilterOptionsForNodeTypes($query->baseNodeTypeFilter),
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
        string $baseNodeTypeFilter
    ): NodeTypeFilterOptions {
        $nodeTypeFilter = NodeTypeFilter::fromFilterString(
            $baseNodeTypeFilter,
            $this->nodeTypeConstraintFactory,
            $this->nodeTypeManager,
        );

        return NodeTypeFilterOptions::fromNodeTypeNames(
            $nodeTypeFilter->allowedNodeTypeNames,
            $this->nodeTypeManager,
        );
    }
}
