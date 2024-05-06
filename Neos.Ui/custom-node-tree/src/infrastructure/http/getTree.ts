/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { fetchWithErrorHandling } from "@sitegeist/archaeopteryx-neos-bridge";

import { TreeNodeDTO } from "../../domain";

type GetTreeQuery = {
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    leafNodeTypeFilter: string;
    searchTerm: string;
    selectedNodeId?: string;
};

type GetTreeQueryResultEnvelope = {
    success: {
        root: TreeNodeDTO;
    };
};

export async function getTree(
    query: GetTreeQuery
): Promise<GetTreeQueryResultEnvelope> {
    const searchParams = new URLSearchParams();

    searchParams.set("workspaceName", query.workspaceName);
    for (const [dimensionName, fallbackChain] of Object.entries(
        query.dimensionValues
    )) {
        for (const fallbackValue of fallbackChain) {
            searchParams.set(
                `dimensionValues[${dimensionName}][]`,
                fallbackValue
            );
        }
    }
    searchParams.set("startingPoint", query.startingPoint);
    searchParams.set("loadingDepth", String(query.loadingDepth));
    searchParams.set("baseNodeTypeFilter", query.baseNodeTypeFilter);
    searchParams.set("leafNodeTypeFilter", query.leafNodeTypeFilter);
    searchParams.set("searchTerm", query.searchTerm);

    if (query.selectedNodeId) {
        searchParams.set("selectedNodeId", query.selectedNodeId);
    }

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    "/sitegeist/archaeopteryx/get-tree?" +
                    searchParams.toString(),
                method: "GET",
                credentials: "include",
                headers: {
                    "X-Flow-Csrftoken": csrfToken,
                    "Content-Type": "application/json",
                },
            })
        );

        return fetchWithErrorHandling.parseJson(response);
    } catch (error) {
        fetchWithErrorHandling.generalErrorHandler(error as any);
        throw error;
    }
}
