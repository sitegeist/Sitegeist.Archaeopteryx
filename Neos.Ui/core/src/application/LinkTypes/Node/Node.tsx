import * as React from 'react';
import {useAsync} from 'react-use';

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
    useSelector
} from '@sitegeist/archaeopteryx-neos-bridge';
import {NodeTree} from '@sitegeist/archaeopteryx-custom-node-tree';

import {Process, makeLinkType, Field} from '../../../domain';
import {IconCard, IconLabel} from '../../../presentation';

const nodeCache = new Map<string, INodePartialForTree>();

export const Node = makeLinkType<{
    node: INodePartialForTree
}, {
    startingPoint: string
    baseNodeType: NodeTypeName
    loadingDepth: number
}>('Sitegeist.Archaeopteryx:Node', ({createError}) => ({
    isSuitableFor: link => link.href.startsWith('node://'),

    useResolvedModel: link => {
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
                return {node: nodeCache.get(cacheIdentifier)!};
            }

            const result = await q(siteNodeContextPath).find(`#${identifier}`)
                .getForTree();

            for (const node of result) {
                const model = {node};
                nodeCache.set(cacheIdentifier, model.node);
                return model;
            }

            throw createError(`Could not find node for identifier "${identifier}".`);
        }, [link.href, siteNodeContextPath]);

        return Process.fromAsyncState(asyncState);
    },

    convertModelToLink: ({node}) => ({
        href: `node://${node.identifier}`
    }),

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="file">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Node:title')}
            </IconLabel>
        );
    },

    Preview: ({model: {node}}) =>  {
        const nodeSummary = useNodeSummary(node.identifier!);
        const nodeType = useNodeType(node.nodeType ?? NodeTypeName('Neos.Neos:Document'));

        return (
            <IconCard
                icon={nodeType?.ui?.icon ?? 'square'}
                title={nodeSummary.value?.label ?? node.label}
                subTitle={nodeSummary.value?.breadcrumb ?? `node://${node.identifier}`}
            />
        );
    },

    Editor: ({model, options}) => {
        const i18n = useI18n();
        const siteNodeContextPath = useSiteNodeContextPath();
        const documentNodeContextPath = useDocumentNodeContextPath();
        const baseNodeTypeName = useConfiguration(c => c.nodeTree?.presets?.default?.baseNodeType) ?? NodeTypeName('Neos.Neos:Document');
        const loadingDepth = useConfiguration(c => c.nodeTree?.loadingDepth) ?? 4;
        const initialSearchTerm = useSelector(state => state.ui?.pageTree?.query) ?? '';
        const initialNodeTypeFilter = useSelector(state => state.ui?.pageTree?.filterNodeType) ?? '';

        if (!siteNodeContextPath) {
            throw createError('Could not load node tree, because siteNodeContextPath could not be determined.');
        } else if (!documentNodeContextPath) {
            throw createError('Could not load node tree, because documentNodeContextPath could not be determined.');
        } else {
            return (
                <Field<null | INodePartialForTree>
                    name="node"
                    initialValue={model?.node}
                    validate={value => {
                        if (!value) {
                            return i18n('Sitegeist.Archaeopteryx:LinkTypes.Node:node.validation.required');
                        }
                    }}
                >{({input}) => (
                    <NodeTree
                        configuration={{
                            baseNodeTypeName:
                                options.baseNodeType as NodeTypeName ?? baseNodeTypeName,
                            rootNodeContextPath: options.startingPoint
                                ? siteNodeContextPath.adopt(options.startingPoint) ?? siteNodeContextPath
                                : siteNodeContextPath,
                            documentNodeContextPath,
                            selectedNodeContextPath: input.value?.contextPath,
                            loadingDepth: options.loadingDepth ?? loadingDepth
                        }}
                        options={{
                            enableSearch: true,
                            enableNodeTypeFilter: true
                        }}
                        initialSearchTerm={initialSearchTerm}
                        initialNodeTypeFilter={initialNodeTypeFilter}
                        onSelect={node =>{
                            const cacheIdentifier = `${node.identifier}@${siteNodeContextPath.context}`;
                            nodeCache.set(cacheIdentifier, node);
                            input.onChange(node);
                        }}
                    />
                )}</Field>
            );
        }
    }
}));
