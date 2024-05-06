/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from "react";
import { useAsync } from "react-use";

import { SelectBox } from "@neos-project/react-ui-components";
import { useI18n } from "@sitegeist/archaeopteryx-neos-bridge";

import { getNodeTypeFilterOptions } from "../infrastructure/http";

const searchNodeTypeFilterOptions = (
    searchTerm: string,
    options: {
        value: string;
        label: any;
        icon?: string;
    }[]
) =>
    options.filter(
        (option) =>
            option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

interface Props {
    baseNodeTypeFilter: string;
    value: string;
    onChange: (value: string) => void;
}

export const SelectNodeTypeFilter: React.FC<Props> = (props) => {
    const i18n = useI18n();
    const [filterTerm, setFilterTerm] = React.useState("");
    const fetch__options = useAsync(async () => {
        const result = await getNodeTypeFilterOptions({
            baseNodeTypeFilter: props.baseNodeTypeFilter,
        });

        return result.success.options;
    }, [props.baseNodeTypeFilter]);
    const options = React.useMemo(() => {
        return searchNodeTypeFilterOptions(
            filterTerm,
            fetch__options.value ?? []
        );
    }, [filterTerm, fetch__options.value]);

    return (
        <SelectBox
            disabled={fetch__options.loading}
            placeholder={i18n("Neos.Neos:Main:filter")}
            placeholderIcon={"filter"}
            onValueChange={props.onChange}
            allowEmpty={true}
            value={props.value}
            options={options}
            displaySearchBox={true}
            searchTerm={filterTerm}
            onSearchTermChange={setFilterTerm}
            threshold={0}
            noMatchesFoundLabel={i18n("Neos.Neos:Main:noMatchesFound")}
            searchBoxLeftToTypeLabel={i18n(
                "Neos.Neos:Main:searchBoxLeftToType"
            )}
        />
    );
};
