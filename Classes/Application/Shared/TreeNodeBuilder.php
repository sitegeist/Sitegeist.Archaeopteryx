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

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\NodeAggregate\NodeAggregateIdentifier;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
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
     * @param NodeTypeName[] $nodeTypeNames
     * @param TreeNodeBuilder[] $children
     */
    private function __construct(
        public readonly int $sortingIndex,
        private NodeAggregateIdentifier $nodeAggregateIdentifier,
        private string $icon,
        private string $label,
        private string $nodeTypeLabel,
        private bool $isMatchedByFilter,
        private bool $isLinkable,
        private bool $isDisabled,
        private bool $isHiddenInMenu,
        private bool $hasScheduledDisabledState,
        private bool $hasUnloadedChildren,
        private array $nodeTypeNames,
        private array $children
    ) {
    }

    public static function fromNode(Node $node): self
    {
        return new self(
            // @phpstan-ignore-next-line
            sortingIndex: $node->getIndex() ?? 0,
            nodeAggregateIdentifier: $node->getNodeAggregateIdentifier(),
            icon: $node->getNodeType()->getConfiguration('ui.icon') ?? 'questionmark',
            label: $node->getLabel(),
            nodeTypeLabel: $node->getNodeType()->getLabel(),
            isMatchedByFilter: false,
            isLinkable: false,
            isDisabled: $node->isHidden(),
            isHiddenInMenu: $node->isHiddenInIndex(),
            hasScheduledDisabledState:
                $node->getHiddenBeforeDateTime() !== null
                || $node->getHiddenAfterDateTime() !== null,
            hasUnloadedChildren: false,
            nodeTypeNames: iterator_to_array(
                self::getAllNonAbstractSuperTypesOf($node->getNodeType()),
                false
            ),
            children: [],
        );
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
        if (!isset($this->childrenByIdentifier[(string) $childBuilder->nodeAggregateIdentifier])) {
            $this->children[] = $childBuilder;
            $this->childrenByIdentifier[(string) $childBuilder->nodeAggregateIdentifier] = $childBuilder;
        }

        return $this;
    }

    public function build(): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $this->nodeAggregateIdentifier,
            icon: $this->icon,
            label: $this->label,
            nodeTypeLabel: $this->nodeTypeLabel,
            isMatchedByFilter: $this->isMatchedByFilter,
            isLinkable: $this->isLinkable,
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

        usort(
            $this->children,
            fn (TreeNodeBuilder $a, TreeNodeBuilder $b) =>
                $a->sortingIndex <=> $b->sortingIndex
        );

        foreach ($this->children as $childBuilder) {
            $items[] = $childBuilder->build();
        }

        return new TreeNodes(...$items);
    }

   /**
    * @return \Traversable<int,NodeTypeName>
    */
   private static function getAllNonAbstractSuperTypesOf(NodeType $nodeType): \Traversable
   {
       if (!$nodeType->isAbstract()) {
           yield NodeTypeName::fromString($nodeType->getName());
       }

       foreach ($nodeType->getDeclaredSuperTypes() as $superType) {
           yield from self::getAllNonAbstractSuperTypesOf($superType);
       }
   }
}
