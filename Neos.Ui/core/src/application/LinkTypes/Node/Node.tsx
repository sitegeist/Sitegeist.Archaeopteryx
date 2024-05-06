/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from "react";
import { useAsync } from "react-use";
import { Nullable } from "ts-toolbelt/out/Union/Nullable";
import { OptionalDeep } from "ts-toolbelt/out/Object/Optional";

import {
    useSiteNodeContextPath,
    useConfiguration,
    useI18n,
    useSelector,
    usePersonalWorkspaceName,
    useDimensionValues,
} from "@sitegeist/archaeopteryx-neos-bridge";
import { Tree } from "@sitegeist/archaeopteryx-custom-node-tree";

import { ILink, makeLinkType } from "../../../domain";
import { IconCard, IconLabel } from "../../../presentation";
import { Process, Field } from "../../../framework";
import { getNodeSummary } from "../../../infrastructure/http";

type NodeLinkModel = {
    nodeId: string;
};
type NodeLinkOptions = {
    startingPoint: string;
    baseNodeType: string;
    loadingDepth: number;
    allowedNodeTypes: string[];
};

const NodePreview: React.FC<{ nodeId: string }> = (props) => {
    const i18n = useI18n();
    const workspaceName = usePersonalWorkspaceName();
    const dimensionValues = useDimensionValues();
    const fetch__nodeSummary = useAsync(async () => {
        if (!workspaceName) {
            return null;
        }
        if (!dimensionValues) {
            return null;
        }
        const result = await getNodeSummary({
            workspaceName,
            dimensionValues,
            nodeId: props.nodeId,
        });

        if ("success" in result) {
            return result.success;
        }

        return null;
    }, [props.nodeId, workspaceName, dimensionValues]);
    const breadcrumbs = fetch__nodeSummary.value?.breadcrumbs
        .map(({ label }) => label)
        .join(" > ");

    return (
        <IconCard
            icon={fetch__nodeSummary.value?.icon ?? "ban"}
            title={
                fetch__nodeSummary.value?.label ??
                `[${i18n(
                    "Sitegeist.Archaeopteryx:LinkTypes.Node:labelOfNonExistingNode"
                )}]`
            }
            subTitle={breadcrumbs ?? `node://${props.nodeId}`}
        />
    );
};

export const Node = makeLinkType<NodeLinkModel, NodeLinkOptions>(
    "Sitegeist.Archaeopteryx:Node",
    ({ createError }) => ({
        supportedLinkOptions: ["anchor", "title", "targetBlank", "relNofollow"],

        isSuitableFor: (link: ILink) => link.href.startsWith("node://"),

        useResolvedModel: (link: ILink) => {
            const match = /node:\/\/(.*)/.exec(link.href);

            if (!match) {
                throw createError(`Cannot handle href "${link.href}".`);
            }

            const nodeId = match[1];

            return Process.success({ nodeId });
        },

        convertModelToLink: ({ nodeId }: NodeLinkModel) => ({
            href: `node://${nodeId}`,
        }),

        TabHeader: () => {
            const i18n = useI18n();

            return (
                <IconLabel icon="file">
                    {i18n("Sitegeist.Archaeopteryx:LinkTypes.Node:title")}
                </IconLabel>
            );
        },

        Preview: (props: { model: NodeLinkModel }) => {
            return <NodePreview nodeId={props.model.nodeId} />;
        },

        // eslint-disable-next-line max-len
        Editor: ({
            model,
            options,
        }: {
            model: Nullable<NodeLinkModel>;
            options: OptionalDeep<NodeLinkOptions>;
        }) => {
            const i18n = useI18n();
            const workspaceName = usePersonalWorkspaceName();
            const dimensionValues = useDimensionValues();
            const siteNodeContextPath = useSiteNodeContextPath();
            const loadingDepth =
                useConfiguration((c) => c.nodeTree?.loadingDepth) ?? 4;
            const initialSearchTerm =
                useSelector((state) => state.ui?.pageTree?.query) ?? "";
            const initialLeafNodeTypeFilter =
                useSelector((state) => state.ui?.pageTree?.filterNodeType) ??
                "";
            const startingPoint = React.useMemo(
                () => options.startingPoint ?? siteNodeContextPath?.path,
                [options.startingPoint, siteNodeContextPath]
            );

            if (!startingPoint) {
                throw createError(
                    "Could not load node tree, because startingPoint could not be determined."
                );
            } else if (!workspaceName) {
                throw createError(
                    "Could not load node tree, because workspaceName could not be determined."
                );
            } else if (!dimensionValues) {
                throw createError(
                    "Could not load node tree, because dimensionValues could not be determined."
                );
            } else {
                return (
                    <Field<null | string>
                        name="nodeId"
                        initialValue={model?.nodeId}
                        // eslint-disable-next-line consistent-return
                        validate={(value) => {
                            if (!value) {
                                return i18n(
                                    "Sitegeist.Archaeopteryx:LinkTypes.Node:node.validation.required"
                                );
                            }
                        }}
                    >
                        {({ input }) => (
                            <Tree
                                initialSearchTerm={initialSearchTerm}
                                workspaceName={workspaceName}
                                dimensionValues={dimensionValues}
                                startingPoint={startingPoint}
                                loadingDepth={loadingDepth}
                                baseNodeTypeFilter={"Neos.Neos:Document"}
                                initialLeafNodeTypeFilter={
                                    initialLeafNodeTypeFilter
                                }
                                selectedTreeNodeId={input.value ?? undefined}
                                options={{
                                    enableSearch: true,
                                    enableNodeTypeFilter: true,
                                }}
                                onSelect={(nodeId) => {
                                    input.onChange(nodeId);
                                }}
                            />
                        )}
                    </Field>
                );
            }
        },
    })
);
