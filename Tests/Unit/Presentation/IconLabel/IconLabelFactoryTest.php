<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Tests\Unit\Presentation\IconLabel;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\Flow\Tests\UnitTestCase;
use PHPUnit\Framework\Assert;
use Sitegeist\Archaeopteryx\Presentation\IconLabel\IconLabel;
use Sitegeist\Archaeopteryx\Presentation\IconLabel\IconLabelFactory;

final class IconLabelFactoryTest extends UnitTestCase
{
    /** @return \Traversable<mixed> */
    public static function forNodeTreePresetSamples(): \Traversable
    {
        yield 'empty node tree preset' =>
            [
                [],
                new IconLabel(
                    icon: 'filter',
                    label: 'N/A',
                ),
            ];

        yield 'node tree preset with empty ui configuration' =>
            [
                ['ui' => []],
                new IconLabel(
                    icon: 'filter',
                    label: 'N/A',
                ),
            ];

        yield 'node tree preset with just an icon' =>
            [
                ['ui' => ['icon' => 'globe']],
                new IconLabel(
                    icon: 'globe',
                    label: 'N/A',
                ),
            ];

        yield 'node tree preset with just a label' =>
            [
                ['ui' => ['label' => 'The Node Tree Preset']],
                new IconLabel(
                    icon: 'filter',
                    label: 'The Node Tree Preset',
                ),
            ];

        yield 'node tree preset with icon and label' =>
            [
                [
                    'ui' => [
                        'icon' => 'globe',
                        'label' => 'The Node Tree Preset',
                    ],
                ],
                new IconLabel(
                    icon: 'globe',
                    label: 'The Node Tree Preset',
                ),
            ];
    }

    /**
     * @dataProvider forNodeTreePresetSamples
     * @test
     * @param array<mixed> $nodeTreePreset
     */
    public function createsIconLabelsForNodeTreePresets(
        array $nodeTreePreset,
        IconLabel $expectedIconLabel,
    ): void {
        $iconLabelFactory = new IconLabelFactory();

        Assert::assertEquals(
            expected: $expectedIconLabel,
            actual: $iconLabelFactory->forNodeTreePreset($nodeTreePreset),
        );
    }

    /** @return \Traversable<mixed> */
    public static function forNodeTypeSamples(): \Traversable
    {
        yield 'node type without ui configuration' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Foo'),
                    declaredSuperTypes: [],
                    configuration: [],
                ),
                new IconLabel(
                    icon: 'questionmark',
                    label: 'N/A',
                )
            ];

        yield 'node type with empty ui configuration' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Foo'),
                    declaredSuperTypes: [],
                    configuration: ['ui' => []],
                ),
                new IconLabel(
                    icon: 'questionmark',
                    label: 'N/A',
                )
            ];

        yield 'node type with just an icon' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Foo'),
                    declaredSuperTypes: [],
                    configuration: ['ui' => ['icon' => 'file']],
                ),
                new IconLabel(
                    icon: 'file',
                    label: 'N/A',
                )
            ];

        yield 'node type with just a label' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Foo'),
                    declaredSuperTypes: [],
                    configuration: ['ui' => ['label' => 'Blog Post']],
                ),
                new IconLabel(
                    icon: 'questionmark',
                    label: 'Blog Post',
                )
            ];

        yield 'node type with an icon and a label' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Foo'),
                    declaredSuperTypes: [],
                    configuration: [
                        'ui' => [
                            'icon' => 'file',
                            'label' => 'Blog Post',
                        ],
                    ],
                ),
                new IconLabel(
                    icon: 'file',
                    label: 'Blog Post',
                )
            ];
    }

    /**
     * @dataProvider forNodeTypeSamples
     * @test
     */
    public function createsIconLabelsForNodeTypes(
        NodeType $nodeType,
        IconLabel $expectedIconLabel,
    ): void {
        $iconLabelFactory = new IconLabelFactory();

        Assert::assertEquals(
            expected: $expectedIconLabel,
            actual: $iconLabelFactory->forNodeType($nodeType),
        );
    }
}
