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

use Neos\ContentRepository\Domain\Model\Node;
use Neos\Flow\Annotations as Flow;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNode;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodeBuilder;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeBuilder
{
    /** @var array<string,TreeNodeBuilder> */
    private array $treeNodeBuildersByNodeAggregateIdentifier;

    private function __construct(
        Node $rootNode,
        private readonly TreeNodeBuilder $rootTreeNodeBuilder,
        private readonly NodeSearchSpecification $nodeSearchSpecification,
        private readonly LinkableNodeSpecification $linkableNodeSpecification,
    ) {
        $this->treeNodeBuildersByNodeAggregateIdentifier[(string) $rootNode->getNodeAggregateIdentifier()] = $rootTreeNodeBuilder;
    }

    public static function forRootNode(
        Node $rootNode,
        NodeSearchSpecification $nodeSearchSpecification,
        LinkableNodeSpecification $linkableNodeSpecification,
    ): self {
        return new self(
            rootNode: $rootNode,
            rootTreeNodeBuilder: TreeNodeBuilder::fromNode($rootNode),
            nodeSearchSpecification: $nodeSearchSpecification,
            linkableNodeSpecification: $linkableNodeSpecification,
        );
    }

    public function addNodeWithDescendants(Node $node, int $loadingDepth): self
    {
        $addNodeWithChildrenRecursively = function (Node $node, int $loadingDepth) use (&$addNodeWithChildrenRecursively): TreeNodeBuilder {
            $treeNodeBuilder = $this->addNode($node);

            if ($loadingDepth === 0) {
                $treeNodeBuilder->setHasUnloadedChildren(
                    $node->getNumberOfChildNodes($this->nodeSearchSpecification->baseNodeTypeFilter->toFilterString()) > 0,
                );
            } else {
                foreach ($node->getChildNodes($this->nodeSearchSpecification->baseNodeTypeFilter->toFilterString()) as $childNode) {
                    /** @var Node $childNode */
                    $treeNodeBuilder->addChild(
                        $addNodeWithChildrenRecursively($childNode, $loadingDepth - 1)
                    );
                }
            }

            return $treeNodeBuilder;
        };

        $addNodeWithChildrenRecursively($node, $loadingDepth);
        return $this;
    }

    public function addNodeWithAncestors(Node $node): self
    {
        $addNodeAndParentRecursively = function (Node $node) use (&$addNodeAndParentRecursively): TreeNodeBuilder {
            $treeNodeBuilder = $this->addNode($node);

            if ($parentNode = $node->getParent()) {
                /** @var Node $parentNode */
                $parentTreeNodeBuilder = $addNodeAndParentRecursively($parentNode);
                $parentTreeNodeBuilder->addChild($treeNodeBuilder);
            }

            return $treeNodeBuilder;
        };

        $addNodeAndParentRecursively($node);
        return $this;
    }

    public function addNodeWithSiblingsAndAncestors(Node $node): self
    {
        $addNodeWithSiblingsAndParentRecursively = function (Node $node) use (&$addNodeWithSiblingsAndParentRecursively): TreeNodeBuilder {
            $treeNodeBuilder = $this->addNode($node);
            if ($parentNode = $node->getParent()) {
                /** @var Node $parentNode */
                $parentTreeNodeBuilder = $addNodeWithSiblingsAndParentRecursively($parentNode);

                foreach ($parentNode->findChildNodes()->previousAll($node)->toArray() as $siblingNode) {
                    /** @var Node $siblingNode */
                    if ($this->nodeSearchSpecification->baseNodeTypeFilter->isSatisfiedByNode($siblingNode)) {
                        $siblingTreeNodeBuilder = $this->addNode($siblingNode);
                        $siblingTreeNodeBuilder->setHasUnloadedChildren(
                            $siblingNode->getNumberOfChildNodes($this->nodeSearchSpecification->baseNodeTypeFilter->toFilterString()) > 0,
                        );

                        $parentTreeNodeBuilder->addChild($siblingTreeNodeBuilder);
                    }
                }

                $parentTreeNodeBuilder->addChild($treeNodeBuilder);

                foreach ($parentNode->findChildNodes()->nextAll($node)->toArray() as $siblingNode) {
                    /** @var Node $siblingNode */
                    if ($this->nodeSearchSpecification->baseNodeTypeFilter->isSatisfiedByNode($siblingNode)) {
                        $siblingTreeNodeBuilder = $this->addNode($siblingNode);
                        $siblingTreeNodeBuilder->setHasUnloadedChildren(
                            $siblingNode->getNumberOfChildNodes($this->nodeSearchSpecification->baseNodeTypeFilter->toFilterString()) > 0,
                        );

                        $parentTreeNodeBuilder->addChild($siblingTreeNodeBuilder);
                    }
                }

                $parentTreeNodeBuilder->setHasUnloadedChildren(false);
            }

            return $treeNodeBuilder;
        };

        $leafTreeNodeBuilder = $addNodeWithSiblingsAndParentRecursively($node);
        $leafTreeNodeBuilder->setHasUnloadedChildren(
            $node->getNumberOfChildNodes($this->nodeSearchSpecification->baseNodeTypeFilter->toFilterString()) > 0,
        );

        return $this;
    }

    public function build(): TreeNode
    {
        return $this->rootTreeNodeBuilder->build();
    }

    private function addNode(Node $node): TreeNodeBuilder
    {
        $treeNodeBuilder = $this->treeNodeBuildersByNodeAggregateIdentifier[
            (string) $node->getNodeAggregateIdentifier()
        ] ??= TreeNodeBuilder::fromNode($node);

        $treeNodeBuilder->setIsMatchedByFilter(
            $this->nodeSearchSpecification->isSatisfiedByNode($node)
        );

        $treeNodeBuilder->setIsLinkable(
            $this->linkableNodeSpecification->isSatisfiedByNode($node)
        );

        return $treeNodeBuilder;
    }
}
