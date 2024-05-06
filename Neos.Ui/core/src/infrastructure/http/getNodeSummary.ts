/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { fetchWithErrorHandling } from "@sitegeist/archaeopteryx-neos-bridge";

type GetNodeSummaryQuery = {
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    nodeId: string;
};

type GetNodeSummaryQueryResultEnvelope = {
    success: {
        icon: string;
        label: string;
        uri: string;
        breadcrumbs: {
            icon: string;
            label: string;
        }[];
    };
};

export async function getNodeSummary(
    query: GetNodeSummaryQuery
): Promise<GetNodeSummaryQueryResultEnvelope> {
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
    searchParams.set("nodeId", query.nodeId);

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    "/sitegeist/archaeopteryx/get-node-summary?" +
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
