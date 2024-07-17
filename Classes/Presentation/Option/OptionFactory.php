<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Presentation\Option;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Presentation\IconLabel\IconLabelFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class OptionFactory
{
    public function __construct(
        private readonly IconLabelFactory $iconLabelFactory,
    ) {
    }

    /** @param array<mixed> $nodeTreePreset */
    public function forNodeTreePreset(array $nodeTreePreset): Option
    {
        return new Option(
            value: isset($nodeTreePreset['baseNodeType']) && is_string($nodeTreePreset['baseNodeType'])
                ? $nodeTreePreset['baseNodeType']
                : '',
            label: $this->iconLabelFactory->forNodeTreePreset($nodeTreePreset),
        );
    }

    public function forNodeType(NodeType $nodeType): Option
    {
        return new Option(
            value: $nodeType->name->value,
            label: $this->iconLabelFactory->forNodeType($nodeType),
        );
    }
}
