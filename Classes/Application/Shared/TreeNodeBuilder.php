<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Application\Shared;

use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Psr\Http\Message\UriInterface;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNodeBuilder
{
    /**
     * @param NodeTypeName[] $nodeTypeNames
     * @param TreeNodeBuilder[] $children
     */
    public function __construct(
        private NodeAggregateIdentifier $nodeAggregateIdentifier,
        private UriInterface $uri,
        private string $icon,
        private string $label,
        private string $nodeTypeLabel,
        private bool $isMatchedByFilter,
        private bool $isDisabled,
        private bool $isHiddenInMenu,
        private bool $hasScheduledDisabledState,
        private bool $hasUnloadedChildren,
        private array $nodeTypeNames,
        private array $children
    ) {
    }

    public function setIsMatchedByFilter(bool $value): self
    {
        $this->isMatchedByFilter = $value;
        return $this;
    }

    public function addChild(TreeNodeBuilder $childBuilder): self
    {
        $this->children[] = $childBuilder;
        return $this;
    }

    public function build(): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $this->nodeAggregateIdentifier,
            uri: $this->uri,
            icon: $this->icon,
            label: $this->label,
            nodeTypeLabel: $this->nodeTypeLabel,
            isMatchedByFilter: $this->isMatchedByFilter,
            isDisabled: $this->isDisabled,
            isHiddenInMenu: $this->isHiddenInMenu,
            hasScheduledDisabledState: $this->hasScheduledDisabledState,
            hasUnloadedChildren: $this->hasUnloadedChildren,
            nodeTypeNames: $this->nodeTypeNames,
            children: $this->buildChildren(),
        );
    }

    private function buildChildren(): TreeNodes
    {
        $items = [];

        foreach ($this->children as $childBuilder) {
            $items[] = $childBuilder->build();
        }

        return new TreeNodes(...$items);
    }
}
