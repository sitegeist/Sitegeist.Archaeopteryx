/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { useSelector } from "../Extensibility/Store";

export function useDimensionValues(): null | Record<string,string[]> {
    const dimensionValues = useSelector(
        (state) => state.cr?.contentDimensions?.active
    );

    return dimensionValues ?? null;
}
