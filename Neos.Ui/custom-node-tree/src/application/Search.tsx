/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from "react";
import { useDebounce } from "react-use";

import { SearchInput } from "../presentation";

interface Props {
    initialValue: string;
    onChange: (value: string) => void;
}

export const Search: React.FC<Props> = (props) => {
    const [value, setValue] = React.useState(props.initialValue);
    const handleClear = React.useCallback(() => {
        setValue("");
    }, [setValue]);

    useDebounce(
        () => {
            if (value.length !== 0 && value.length < 2) return
            props.onChange(value);
        },
        300,
        [value]
    );

    return (
        <SearchInput value={value} onChange={setValue} onClear={handleClear} />
    );
};
