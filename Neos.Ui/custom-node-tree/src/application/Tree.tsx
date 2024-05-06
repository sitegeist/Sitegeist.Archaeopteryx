/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from "react";
import { useAsync } from "react-use";
import { VError } from "verror";

import { Tree as NeosTree } from "@neos-project/react-ui-components";
import { decodeError } from "@sitegeist/archaeopteryx-error-handling";

import { TreeNode } from "./TreeNode";
import { Search } from "./Search";
import { SelectNodeTypeFilter } from "./SelectNodeTypeFilter";
import { getTree } from "../infrastructure/http";

interface Props {
    initialSearchTerm?: string;
    initialLeafNodeTypeFilter?: string;
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    selectedTreeNodeId?: string;
    options?: {
        enableSearch?: boolean;
        enableNodeTypeFilter?: boolean;
    };
    onSelect(nodeId: string): void;
}

export const Tree: React.FC<Props> = (props) => {
    const [searchTerm, setSearchTerm] = React.useState<string>(
        props.initialSearchTerm ?? ""
    );
    const [leafNodeTypeFilter, setLeafNodeTypeFilter] = React.useState<string>(
        props.initialLeafNodeTypeFilter ?? ""
    );
    const fetch__getTree = useAsync(async () => {
        const result = await getTree({
            workspaceName: props.workspaceName,
            dimensionValues: props.dimensionValues,
            startingPoint: props.startingPoint,
            loadingDepth: props.loadingDepth,
            baseNodeTypeFilter: props.baseNodeTypeFilter,
            selectedNodeId: props.selectedTreeNodeId,
            leafNodeTypeFilter,
            searchTerm,
        });

        if ("success" in result) {
            return result.success;
        }

        throw new VError("Something went wrong while fetching the tree.");
    }, [
        props.workspaceName,
        props.dimensionValues,
        props.startingPoint,
        props.loadingDepth,
        props.baseNodeTypeFilter,
        leafNodeTypeFilter,
        searchTerm,
    ]);
    const handleTreeNodeClick = React.useCallback((treeNodeId: string) => {
        props.onSelect(treeNodeId);
    }, []);
    const handleSearchTermChange = React.useCallback(
        (newSearchTerm: string) => {
            setSearchTerm(newSearchTerm);
        },
        []
    );
    const handleNodeTypeFilterChange = React.useCallback(
        (newNodeTypeFilter: string) => {
            setLeafNodeTypeFilter(newNodeTypeFilter);
        },
        []
    );

    let main;
    if (fetch__getTree.error) {
        throw new VError(
            decodeError(fetch__getTree.error),
            "NodeTree could not be loaded."
        );
    } else if (fetch__getTree.loading || !fetch__getTree.value) {
        main = <div>Loading...</div>;
    } else {
        main = (
            <NeosTree>
                <TreeNode
                    workspaceName={props.workspaceName}
                    dimensionValues={props.dimensionValues}
                    baseNodeTypeFilter={props.baseNodeTypeFilter}
                    treeNode={fetch__getTree.value.root}
                    selectedTreeNodeId={props.selectedTreeNodeId}
                    level={1}
                    onClick={handleTreeNodeClick}
                />
            </NeosTree>
        );
    }

    let search = null;
    if (props.options?.enableSearch) {
        search = (
            <Search
                initialValue={props.initialSearchTerm ?? ""}
                onChange={handleSearchTermChange}
            />
        );
    }

    let filter = null;
    if (props.options?.enableNodeTypeFilter) {
        filter = (
            <SelectNodeTypeFilter
                baseNodeTypeFilter={props.baseNodeTypeFilter}
                value={leafNodeTypeFilter}
                onChange={handleNodeTypeFilterChange}
            />
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                backgroundColor: "#141414",
                border: "1px solid #3f3f3f",
            }}
        >
            {search ? (
                <div
                    style={{
                        gridColumn: filter ? "1 / span 1" : "1 / span 2",
                    }}
                >
                    {search}
                </div>
            ) : null}
            {filter ? (
                <div
                    style={{
                        gridColumn: search ? "2 / span 1" : "1 / span 2",
                    }}
                >
                    {filter}
                </div>
            ) : null}
            {main ? (
                <div
                    style={{
                        marginTop: "-5px",
                        borderTop: "1px solid #3f3f3f",
                        gridColumn: "1 / span 2",
                        height: "50vh",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {main}
                </div>
            ) : null}
        </div>
    );
};