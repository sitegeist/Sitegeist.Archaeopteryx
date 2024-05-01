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

use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilterOptions implements \JsonSerializable
{
    /** @var NodeTypeFilterOption[] */
    private readonly array $items;

    public function __construct(NodeTypeFilterOption ...$items)
    {
        $this->items = array_values($items);
    }

    public static function fromTreeNode(TreeNode $treeNode, NodeTypeManager $nodeTypeManager): self
    {
        $nodeTypeNames = iterator_to_array($treeNode->getNodeTypeNamesForFilterRecursively());
        return self::fromNodeTypeNames($nodeTypeNames, $nodeTypeManager);
    }

    public static function fromTreeNodes(TreeNodes $treeNodes, NodeTypeManager $nodeTypeManager): self
    {
        $nodeTypeNames = iterator_to_array($treeNodes->getNodeTypeNamesForFilterRecursively());
        return self::fromNodeTypeNames($nodeTypeNames, $nodeTypeManager);
    }

    /**
     * @param array<string,NodeTypeName> $nodeTypeNames
     */
    private static function fromNodeTypeNames(array $nodeTypeNames, NodeTypeManager $nodeTypeManager): self
    {
        $items = [];

        foreach ($nodeTypeNames as $nodeTypeName) {
            $nodeType = $nodeTypeManager->getNodeType((string) $nodeTypeName);
            $items[] = NodeTypeFilterOption::fromNodeType($nodeType);
        }

        return new self(...$items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }
}
