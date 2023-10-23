<?php

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx;

use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverter\AbstractTypeConverter;
use Neos\Flow\Property\TypeConverter\ArrayFromObjectConverter;

/**
 * Until {@see https://github.com/neos/neos-development-collection/pull/4638} is fixed in {@see \Neos\Neos\Service\Mapping\NodePropertyConverterService::convertValue} we must prevent that the
 * {@see Link} is converted via the {@see ArrayFromObjectConverter} as this fails when converting the {@see \GuzzleHttp\Psr7\Uri} in {@see Link::$href}.
 */
class LinkToArrayForNeosUiConverter extends AbstractTypeConverter
{
    protected $sourceTypes = [Link::class];

    protected $targetType = 'array';

    protected $priority = 100;

    public function convertFrom($source, $targetType, array $convertedChildProperties = [], PropertyMappingConfigurationInterface $configuration = null)
    {
        if (!$source instanceof Link) {
            throw new \InvalidArgumentException('Expected argument $source to be of type Link, got: ' . get_debug_type($source), 1697972165);
        }
        return $source->jsonSerialize();
    }
}
