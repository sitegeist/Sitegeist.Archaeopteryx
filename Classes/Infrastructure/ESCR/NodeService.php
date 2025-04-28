<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Infrastructure\ESCR;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Dto\SubtreeTag;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\NodeType\NodeTypeNames;
use Neos\ContentRepository\Core\Projection\ContentGraph\AbsoluteNodePath;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\CountChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindAncestorNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindDescendantNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindPrecedingSiblingNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindSucceedingSiblingNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Nodes;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Sitegeist\Archaeopteryx\Application\Shared\NodeTypeWasNotFound;
use Sitegeist\Archaeopteryx\Application\Shared\NodeWasNotFound;
use Sitegeist\Archaeopteryx\Application\Shared\TreeNodeBuilder;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeService
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        public readonly ContentSubgraphInterface $subgraph,
        private readonly NodeLabelGeneratorInterface $nodeLabelGenerator
    ) {
    }

    public function requireNodeById(NodeAggregateId $nodeAggregateId): Node
    {
        $node = $this->findNodeById($nodeAggregateId);
        if ($node === null) {
            throw NodeWasNotFound::becauseNodeWithGivenIdentifierDoesNotExistInCurrentSubgraph(
                nodeAggregateId: $nodeAggregateId,
                subgraph: $this->subgraph,
            );
        }

        return $node;
    }

    public function findNodeById(NodeAggregateId $nodeAggregateId): ?Node
    {
        return $this->subgraph->findNodeById($nodeAggregateId);
    }

    public function requireNodeTypeByName(NodeTypeName $nodeTypeName): NodeType
    {
        $nodeType = $this->contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName);
        if ($nodeType === null) {
            throw NodeTypeWasNotFound::becauseNodeTypeWithGivenNameDoesNotExistInCurrentSchema(
                nodeTypeName: $nodeTypeName,
                contentRepositoryId: $this->contentRepository->id,
            );
        }

        return $nodeType;
    }

    public function getLabelForNode(Node $node): string
    {
        return $this->nodeLabelGenerator->getLabel($node);
    }

    public function findParentNode(Node $node): ?Node
    {
        return $this->subgraph->findParentNode($node->aggregateId);
    }

    public function findPrecedingSiblingNodes(Node $node): Nodes
    {
        $filter = FindPrecedingSiblingNodesFilter::create();

        return $this->subgraph->findPrecedingSiblingNodes($node->aggregateId, $filter);
    }

    public function findSucceedingSiblingNodes(Node $node): Nodes
    {
        $filter = FindSucceedingSiblingNodesFilter::create();

        return $this->subgraph->findSucceedingSiblingNodes($node->aggregateId, $filter);
    }

    public function findNodeByAbsoluteNodePath(AbsoluteNodePath $path): ?Node
    {
        return $this->subgraph->findNodeByAbsolutePath($path);
    }

    public function search(Node $rootNode, string $searchTerm, NodeTypeFilter $nodeTypeFilter): Nodes
    {
        $filter = FindDescendantNodesFilter::create(
            searchTerm: $searchTerm,
            nodeTypes: $nodeTypeFilter->nodeTypeCriteria
        );

        return $this->subgraph->findDescendantNodes($rootNode->aggregateId, $filter);
    }

    public function createNodeTypeFilterFromFilterString(string $filterString): NodeTypeFilter
    {
        $nodeTypeManager = $this->contentRepository->getNodeTypeManager();
        $nodeTypeCriteria = NodeTypeCriteria::fromFilterString($filterString);
        $explicitlyAllowedNodeTypeNames = $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->toStringArray();
        $explicitlyDisallowedNodeTypeNames = $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->toStringArray();
        $isEmpty =  $nodeTypeCriteria->explicitlyAllowedNodeTypeNames->isEmpty()
            && $nodeTypeCriteria->explicitlyDisallowedNodeTypeNames->isEmpty();

        $allowedNodeTypeNames = [];
        foreach ($nodeTypeManager->getNodeTypes(true) as $candidateNodeType) {
            if ($isEmpty) {
                $allowedNodeTypeNames[] = $candidateNodeType->name;
                continue;
            }

            foreach ($explicitlyDisallowedNodeTypeNames as $disallowedNodeTypeName) {
                if ($candidateNodeType->isOfType($disallowedNodeTypeName)) {
                    continue 2;
                }
            }

            foreach ($explicitlyAllowedNodeTypeNames as $allowedNodeTypeName) {
                if ($candidateNodeType->isOfType($allowedNodeTypeName)) {
                    $allowedNodeTypeNames[] = $candidateNodeType->name;
                    continue 2;
                }
            }
        }

        return new NodeTypeFilter(
            nodeTypeCriteria: $nodeTypeCriteria,
            allowedNodeTypeNames: NodeTypeNames::fromArray($allowedNodeTypeNames)
        );
    }

    public function createNodeTypeFilterFromNodeTypeNames(NodeTypeNames $nodeTypeNames): NodeTypeFilter
    {
        $nodeTypeManager = $this->contentRepository->getNodeTypeManager();
        $isEmpty = $nodeTypeNames->isEmpty();

        $allowedNodeTypeNames = [];
        foreach ($nodeTypeManager->getNodeTypes(true) as $candidateNodeType) {
            if ($isEmpty) {
                $allowedNodeTypeNames[] = $candidateNodeType->name;
                continue;
            }

            foreach ($nodeTypeNames as $nodeTypeName) {
                if ($candidateNodeType->isOfType($nodeTypeName)) {
                    $allowedNodeTypeNames[] = $candidateNodeType->name;
                    continue 2;
                }
            }
        }

        return new NodeTypeFilter(
            nodeTypeCriteria: NodeTypeCriteria::createWithAllowedNodeTypeNames($nodeTypeNames),
            allowedNodeTypeNames: NodeTypeNames::fromArray($allowedNodeTypeNames)
        );
    }

    public function createTreeBuilderForRootNode(
        Node $rootNode,
        NodeSearchSpecification $nodeSearchSpecification,
        LinkableNodeSpecification $linkableNodeSpecification,
    ): TreeBuilder {
        return new TreeBuilder(
            rootNode: $rootNode,
            nodeService: $this,
            rootTreeNodeBuilder: $this->createTreeNodeBuilderForNode($rootNode),
            nodeSearchSpecification: $nodeSearchSpecification,
            linkableNodeSpecification: $linkableNodeSpecification,
        );
    }

    public function createTreeNodeBuilderForNode(Node $node): TreeNodeBuilder
    {
        $nodeType = $this->requireNodeTypeByName($node->nodeTypeName);

        return new TreeNodeBuilder(
            // @TODO: Figure this one out
            sortingIndex: 0,
            nodeAggregateId: $node->aggregateId,
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $this->getLabelForNode($node),
            nodeTypeLabel: $nodeType->getLabel(),
            isMatchedByFilter: false,
            isLinkable: false,
            isDisabled: $node->tags->withoutInherited()->contain(SubtreeTag::disabled()),
            isHiddenInMenu: $node->getProperty('hiddenInMenu') ?? false,
            hasScheduledDisabledState:
                $node->getProperty('enableAfterDateTime') instanceof \DateTimeInterface
                || $node->getProperty('disableAfterDateTime') instanceof \DateTimeInterface,
            hasUnloadedChildren: false,
            children: [],
        );
    }

    public function findChildNodes(Node $parentNode, NodeTypeCriteria $nodeTypeCriteria): Nodes
    {
        $filter = FindChildNodesFilter::create(
            nodeTypes: $nodeTypeCriteria,
        );

        return $this->subgraph->findChildNodes($parentNode->aggregateId, $filter);
    }

    public function getNumberOfChildNodes(Node $parentNode, NodeTypeCriteria $nodeTypeCriteria): int
    {
        $filter = CountChildNodesFilter::create(
            nodeTypes: $nodeTypeCriteria,
        );

        return $this->subgraph->countChildNodes($parentNode->aggregateId, $filter);
    }

    public function findAncestorNodes(Node $node): Nodes
    {
        $filter = FindAncestorNodesFilter::create();

        return $this->subgraph->findAncestorNodes($node->aggregateId, $filter);
    }
}
