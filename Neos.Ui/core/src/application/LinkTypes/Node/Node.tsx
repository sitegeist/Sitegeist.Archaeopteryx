import * as React from 'react';
import {useAsync} from 'react-use';

import {q, INodePartialForTree, NodeTypeName, useSiteNodeContextPath, useDocumentNodeContextPath, useConfiguration, useNodeSummary, useNodeType} from '@sitegeist/archaeopteryx-neos-bridge';
import {NodeTree} from '@sitegeist/archaeopteryx-custom-node-tree';

import {Process, makeLinkType, Field} from '../../../domain';
import {IconCard} from '../../../presentation';

interface NodeModel {
    node: INodePartialForTree
}

const modelCache = new Map<string, NodeModel>();

export const Node = makeLinkType<NodeModel>(
    'Sitegeist.Archaeopteryx:Node',
    ({createError}) => ({
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

                if (modelCache.has(cacheIdentifier)) {
                    return modelCache.get(cacheIdentifier)!;
                }

                const result = await q(siteNodeContextPath).find(`#${identifier}`)
                    .getForTree();

                for (const node of result) {
                    const props = {node};
                    modelCache.set(cacheIdentifier, props);
                    return props;
                }

                throw createError(`Could not find node for identifier "${identifier}".`);
            }, [link.href, siteNodeContextPath]);

            return Process.fromAsyncState(asyncState);
        },

        convertModelToLink: ({node}) => ({
            href: `node://${node.identifier}`
        }),

        StaticIcon: () => (<div>NODE TREE</div>),

        StaticTitle: () => 'Node Tree',

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

        Editor: ({model}) => {
            const siteNodeContextPath = useSiteNodeContextPath();
            const documentNodeContextPath = useDocumentNodeContextPath();
            const baseNodeTypeName = useConfiguration(c => c.nodeTree?.presets?.default?.baseNodeType) ?? NodeTypeName('Neos.Neos:Document');
            const loadingDepth = useConfiguration(c => c.nodeTree?.loadingDepth) ?? 4;

            if (!siteNodeContextPath) {
                throw createError('Could not load node tree, because siteNodeContextPath could not be determined.');
            } else if (!documentNodeContextPath) {
                throw createError('Could not load node tree, because documentNodeContextPath could not be determined.');
            } else {
                return (
                    <Field<null | INodePartialForTree>
                        name="node"
                        initialValue={model?.node}
                    >{({input}) => (
                        <NodeTree
                            configuration={{
                                baseNodeTypeName,
                                rootNodeContextPath: siteNodeContextPath,
                                documentNodeContextPath,
                                selectedNodeContextPath: input.value?.contextPath,
                                loadingDepth
                            }}
                            options={{
                                enableSearch: true,
                                enableNodeTypeFilter: true
                            }}
                            onSelect={node =>{
                                const cacheIdentifier = `${node.identifier}@${siteNodeContextPath.context}`;
                                modelCache.set(cacheIdentifier, {node});
                                input.onChange(node);
                            }}
                        />
                    )}</Field>
                );
            }
        }
    })
);
