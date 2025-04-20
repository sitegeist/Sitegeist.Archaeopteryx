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

use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNodeBuilder
{
    /** @var array<string,TreeNodeBuilder> */
    private array $childrenByIdentifier;

    /**
     * @param TreeNodeBuilder[] $children
     */
    public function __construct(
        public readonly int $sortingIndex,
        private NodeAggregateId $nodeAggregateId,
        private string $icon,
        private string $label,
        private string $nodeTypeLabel,
        private bool $isMatchedByFilter,
        private bool $isLinkable,
        private bool $isDisabled,
        private bool $isHiddenInMenu,
        private bool $hasScheduledDisabledState,
        private bool $hasUnloadedChildren,
        private array $children
    ) {
    }

    public function setIsMatchedByFilter(bool $value): self
    {
        $this->isMatchedByFilter = $value;
        return $this;
    }

    public function setIsLinkable(bool $value): self
    {
        $this->isLinkable = $value;
        return $this;
    }

    public function setHasUnloadedChildren(bool $value): self
    {
        $this->hasUnloadedChildren = $value;
        return $this;
    }

    public function addChild(TreeNodeBuilder $childBuilder): self
    {
        if (!isset($this->childrenByIdentifier[$childBuilder->nodeAggregateId->value])) {
            $this->children[] = $childBuilder;
            $this->childrenByIdentifier[$childBuilder->nodeAggregateId->value] = $childBuilder;
        }

        return $this;
    }

    public function build(): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $this->nodeAggregateId,
            icon: $this->icon,
            label: $this->label,
            nodeTypeLabel: $this->nodeTypeLabel,
            isMatchedByFilter: $this->isMatchedByFilter,
            isLinkable: $this->isLinkable,
            isDisabled: $this->isDisabled,
            isHiddenInMenu: $this->isHiddenInMenu,
            hasScheduledDisabledState: $this->hasScheduledDisabledState,
            hasUnloadedChildren: $this->hasUnloadedChildren,
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
