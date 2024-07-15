import * as React from 'react';
import { useAsync } from 'react-use';

import {
    q,
    INodePartialForTree,
    NodeTypeName,
    useSiteNodeContextPath,
    useDocumentNodeContextPath,
    useConfiguration,
    useNodeSummary,
    useNodeType,
    useI18n,
    useSelector,
} from '@sitegeist/archaeopteryx-neos-bridge';
import { NodeTree } from '@sitegeist/archaeopteryx-custom-node-tree';

import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import { OptionalDeep } from 'ts-toolbelt/out/Object/Optional';
import { ILink, makeLinkType } from '../../../domain';
import { IconCard, IconLabel } from '../../../presentation';
import { Process, Field } from '../../../framework';

const nodeCache = new Map<string, INodePartialForTree>();

type NodeLinkModel = {
    identifier: string
    // might be not be set if the node was deleted
    node?: INodePartialForTree
};
type NodeLinkOptions = {
    startingPoint: string
    baseNodeType: NodeTypeName
    loadingDepth: number
    allowedNodeTypes: NodeTypeName[]
};

const NodePreview = ({ node }: { node: INodePartialForTree }) => {
    const nodeSummary = useNodeSummary(node.identifier!);
    const nodeType = useNodeType(node.nodeType ?? NodeTypeName('Neos.Neos:Document'));

    return (
        <IconCard
            icon={nodeType?.ui?.icon ?? 'square'}
            title={nodeSummary.value?.label ?? node.label}
            subTitle={nodeSummary.value?.breadcrumb ?? `node://${node.identifier}`}
        />
    );
}

export const Node = makeLinkType<NodeLinkModel, NodeLinkOptions>('Sitegeist.Archaeopteryx:Node', ({ createError }) => ({
    supportedLinkOptions: ['anchor', 'title', 'targetBlank', 'relNofollow'],

    isSuitableFor: (link: ILink) => link.href.startsWith('node://') && !link.href.includes('#'),

    useResolvedModel: (link: ILink) => {
        const siteNodeContextPath = useSiteNodeContextPath();
        const asyncState = useAsync(async () => {
            if (!siteNodeContextPath) {
                throw createError('Could not find siteNodeContextPath.');
            }

            const match = /node:\/\/(.*)/.exec(link.href);

            if (!match) {
                throw createError(`Cannot handle href "${link.href}".`);
            }

            const identifier = match[1];
            const cacheIdentifier = `${identifier}@${siteNodeContextPath.context}`;

            if (nodeCache.has(cacheIdentifier)) {
                return { node: nodeCache.get(cacheIdentifier)!, identifier };
            }

            const result = await q(siteNodeContextPath).find(`#${identifier}`)
                .getForTree();

            // eslint-disable-next-line no-restricted-syntax
            for (const node of result) {
                const model = { node, identifier };
                nodeCache.set(cacheIdentifier, model.node);
                return model;
            }

            // node might have been deleted
            return {
                node: undefined,
                identifier
            }
        }, [link.href, siteNodeContextPath]);

        return Process.fromAsyncState(asyncState);
    },

    convertModelToLink: ({ node }: NodeLinkModel) => ({ href: `node://${node?.identifier}` }),

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="file">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Node:title')}
            </IconLabel>
        );
    },

    Preview: ({ model: { node, identifier } }: { model: NodeLinkModel }) => {
        const i18n = useI18n();

        if (!node) {
            return (
                <IconCard
                    icon='ban'
                    title={`[${i18n('Sitegeist.Archaeopteryx:LinkTypes.Node:labelOfNonExistingNode')}]`}
                    subTitle={`node://${identifier}`}
                />
            );
        }

        return <NodePreview node={node} />
    },

    // eslint-disable-next-line max-len
    Editor: ({ model, options }: { model: Nullable<NodeLinkModel>, options: OptionalDeep<NodeLinkOptions> }) => {
        const i18n = useI18n();
        const siteNodeContextPath = useSiteNodeContextPath();
        const documentNodeContextPath = useDocumentNodeContextPath();
        const baseNodeTypeName = useConfiguration((c) => c.nodeTree?.presets?.default?.baseNodeType) ?? NodeTypeName('Neos.Neos:Document');
        const loadingDepth = useConfiguration((c) => c.nodeTree?.loadingDepth) ?? 4;
        const initialSearchTerm = useSelector((state) => state.ui?.pageTree?.query) ?? '';
        const initialNodeTypeFilter = useSelector((state) => state.ui?.pageTree?.filterNodeType) ?? '';
        const rootNodeContextPath = React.useMemo(() => (options.startingPoint
            ? siteNodeContextPath?.adopt(options.startingPoint) ?? siteNodeContextPath
            : siteNodeContextPath), [options.startingPoint, siteNodeContextPath]);

        if (!rootNodeContextPath) {
            throw createError('Could not load node tree, because rootNodeContextPath could not be determined.');
        } else if (!documentNodeContextPath) {
            throw createError('Could not load node tree, because documentNodeContextPath could not be determined.');
        } else {
            return (
                <Field<null | INodePartialForTree>
                    name="node"
                    initialValue={model?.node}
                    // eslint-disable-next-line consistent-return
                    validate={(value) => {
                        if (!value) {
                            return i18n('Sitegeist.Archaeopteryx:LinkTypes.Node:node.validation.required');
                        }
                    }}
                >{({ input }) => (
                    <NodeTree
                        configuration={{
                            baseNodeTypeName: options.baseNodeType as NodeTypeName ?? baseNodeTypeName,
                            allowedNodeTypes: options.allowedNodeTypes as NodeTypeName[],
                            rootNodeContextPath,
                            documentNodeContextPath,
                            selectedNodeContextPath: input.value?.contextPath,
                            loadingDepth: options.loadingDepth ?? loadingDepth,
                        }}
                        options={{
                            enableSearch: true,
                            enableNodeTypeFilter: true,
                        }}
                        initialSearchTerm={initialSearchTerm}
                        initialNodeTypeFilter={initialNodeTypeFilter}
                        onSelect={(node) => {
                            const cacheIdentifier = `${node.identifier}@${rootNodeContextPath.context}`;
                            nodeCache.set(cacheIdentifier, node);
                            input.onChange(node);
                        }}
                    />
                )}</Field>
            );
        }
    },
}));
