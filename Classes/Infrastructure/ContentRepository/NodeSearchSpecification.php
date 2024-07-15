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
use Neos\Utility\Unicode\Functions as UnicodeFunctions;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeSearchSpecification
{
    public function __construct(
        public readonly NodeTypeFilter $baseNodeTypeFilter,
        public readonly ?NodeTypeFilter $narrowNodeTypeFilter,
        public readonly ?string $searchTerm,
    ) {
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        if (!$this->baseNodeTypeFilter->isSatisfiedByNode($node)) {
            return false;
        }

        if ($this->narrowNodeTypeFilter && !$this->narrowNodeTypeFilter->isSatisfiedByNode($node)) {
            return false;
        }

        if (!$this->nodeContainsSearchTerm($node)) {
            return false;
        }

        return true;
    }

    private function nodeContainsSearchTerm(Node $node): bool
    {
        if ($this->searchTerm === null) {
            return true;
        }

        $term = json_encode(UnicodeFunctions::strtolower($this->searchTerm), JSON_UNESCAPED_UNICODE);
        $term = trim($term ? $term : '', '"');

        /** @var int|false $positionOfTermInLabel */
        $positionOfTermInLabel = UnicodeFunctions::strpos(
            UnicodeFunctions::strtolower($node->getLabel()),
            $term
        );

        if ($positionOfTermInLabel !== false) {
            // Term matches label
            return true;
        }

        //
        // In case the term cannot be found in the node label, we need to
        // replicate how the term is matched against the node properties in the
        // node data repository.
        //
        // Yeah, I know :(
        //
        $nodeData = $node->getNodeData();
        $reflectionNodeData = new \ReflectionObject($nodeData);
        $reflectionProperties = $reflectionNodeData->getProperty('properties');
        $reflectionProperties->setAccessible(true);
        $properties = $reflectionProperties->getValue($nodeData);
        $properties = json_encode($properties, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE);

        return UnicodeFunctions::strpos($properties, $term) !== false;
    }
}
