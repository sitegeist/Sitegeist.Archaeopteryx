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
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\NodeType\NodeTypeConstraintFactory;
use Neos\ContentRepository\Domain\NodeType\NodeTypeName;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilter
{
    /**
     * @param string[] $allowedNodeTypeNames
     */
    private function __construct(
        public readonly string $filterString,
        public readonly array $allowedNodeTypeNames
    ) {
    }

    public static function fromFilterString(
        string $filterString,
        NodeTypeConstraintFactory $nodeTypeConstraintFactory,
        NodeTypeManager $nodeTypeManager,
    ): self {
        $nodeTypeConstraints = $nodeTypeConstraintFactory->parseFilterString($filterString);
        $allowedNodeTypeNames = [];

        foreach ($nodeTypeManager->getNodeTypes(false) as $nodeType) {
            $nodeTypeName = $nodeType->getName();
            if ($nodeTypeConstraints->matches(NodeTypeName::fromString($nodeTypeName))) {
                $allowedNodeTypeNames[] = $nodeTypeName;
            }
        }

        return new self($filterString, $allowedNodeTypeNames);
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        return $this->isSatisfiedByNodeTypeName($node->getNodeTypeName());
    }

    public function isSatisfiedByNodeType(NodeType $nodeType): bool
    {
        return $this->isSatisfiedByNodeTypeNameString($nodeType->getName());
    }

    public function isSatisfiedByNodeTypeName(NodeTypeName $nodeTypeName): bool
    {
        return $this->isSatisfiedByNodeTypeNameString((string) $nodeTypeName);
    }

    private function isSatisfiedByNodeTypeNameString(string $nodeTypeNameString): bool
    {
        return in_array($nodeTypeNameString, $this->allowedNodeTypeNames);
    }
}
