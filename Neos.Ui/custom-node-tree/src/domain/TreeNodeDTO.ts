/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
export type TreeNodeDTO = {
    nodeAggregateIdentifier: string;
    icon: string;
    label: string;
    nodeTypeLabel: string;
    isMatchedByFilter: boolean;
    isLinkable: boolean;
    isDisabled: boolean;
    isHiddenInMenu: boolean;
    hasScheduledDisabledState: boolean;
    hasUnloadedChildren: boolean;
    children: TreeNodeDTO[];
};
