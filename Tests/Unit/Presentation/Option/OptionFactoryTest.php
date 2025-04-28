<?php

/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx\Tests\Unit\Presentation\Option;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\Flow\Tests\UnitTestCase;
use PHPUnit\Framework\Assert;
use PHPUnit\Framework\TestCase;
use Sitegeist\Archaeopteryx\Presentation\IconLabel\IconLabel;
use Sitegeist\Archaeopteryx\Presentation\IconLabel\IconLabelFactory;
use Sitegeist\Archaeopteryx\Presentation\Option\Option;
use Sitegeist\Archaeopteryx\Presentation\Option\OptionFactory;

final class OptionFactoryTest extends TestCase
{
    /** @return \Traversable<mixed> */
    public static function forNodeTreePresetSamples(): \Traversable
    {
        yield 'empty node tree preset' =>
            [
                [],
                new Option(
                    value: '',
                    label: new IconLabel(
                        icon: 'filter',
                        label: 'N/A',
                    ),
                ),
            ];

        yield 'node tree preset with simple baseNodeType configuration' =>
            [
                ['baseNodeType' => 'Neos.Neos:Document'],
                new Option(
                    value: 'Neos.Neos:Document',
                    label: new IconLabel(
                        icon: 'filter',
                        label: 'N/A',
                    ),
                ),
            ];

        yield 'node tree preset with complex baseNodeType configuration' =>
            [
                ['baseNodeType' => 'Vendor.Site:Foo,Vendor.Site:Bar,!Vendor.Site:Baz,!Vendor.Site:Qux,Vendor.Site:Quux'],
                new Option(
                    value: 'Vendor.Site:Foo,Vendor.Site:Bar,!Vendor.Site:Baz,!Vendor.Site:Qux,Vendor.Site:Quux',
                    label: new IconLabel(
                        icon: 'filter',
                        label: 'N/A',
                    ),
                ),
            ];

        yield 'node tree preset with ui configuration' =>
            [
                [
                    'baseNodeType' => 'Neos.Neos:Document',
                    'ui' => [
                        'icon' => 'file',
                        'label' => 'Documents',
                    ],
                ],
                new Option(
                    value: 'Neos.Neos:Document',
                    label: new IconLabel(
                        icon: 'file',
                        label: 'Documents',
                    ),
                ),
            ];
    }

    /**
     * @dataProvider forNodeTreePresetSamples
     * @test
     * @param array<mixed> $nodeTreePreset
     */
    public function createsOptionsForNodeTreePresets(
        array $nodeTreePreset,
        Option $expectedOption,
    ): void {
        $optionFactory = new OptionFactory(
            iconLabelFactory: new IconLabelFactory(),
        );

        Assert::assertEquals(
            expected: $expectedOption,
            actual: $optionFactory->forNodeTreePreset($nodeTreePreset),
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
                new Option(
                    value: 'Vendor.Site:Foo',
                    label: new IconLabel(
                        icon: 'questionmark',
                        label: 'N/A',
                    ),
                ),
            ];

        yield 'node type with ui configuration' =>
            [
                new NodeType(
                    name: NodeTypeName::fromString('Vendor.Site:Townmap'),
                    declaredSuperTypes: [],
                    configuration: [
                        'ui' => [
                            'icon' => 'map',
                            'label' => 'Townmap',
                        ]
                    ],
                ),
                new Option(
                    value: 'Vendor.Site:Townmap',
                    label: new IconLabel(
                        icon: 'map',
                        label: 'Townmap',
                    ),
                ),
            ];
    }

    /**
     * @dataProvider forNodeTypeSamples
     * @test
     */
    public function createsOptionsForNodeTypes(
        NodeType $nodeType,
        Option $expectedOption,
    ): void {
        $optionFactory = new OptionFactory(
            iconLabelFactory: new IconLabelFactory(),
        );

        Assert::assertEquals(
            expected: $expectedOption,
            actual: $optionFactory->forNodeType($nodeType),
        );
    }
}
