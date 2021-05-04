import * as React from 'react';

import {q, INodePartialForTree, NodeTypeName, useSiteNodeContextPath, useDocumentNodeContextPath, useConfiguration} from '@sitegeist/archaeopteryx-neos-bridge';
import {NodeTree as NodeTreeAdapter} from '@sitegeist/archaeopteryx-custom-node-tree';

import {LinkType, ILinkTypeProps, useEditorTransactions, useEditorValue} from '../../../domain';

function useBaseNodeTypeName(): NodeTypeName {
    const baseNodeTypeName = useConfiguration(c => c.nodeTree?.presets?.default?.baseNodeType);
    return baseNodeTypeName ?? NodeTypeName('Neos.Neos:Document');
}

const cache = new Map<string, INodePartialForTree>();

function useResolvedValue() {
    const {value} = useEditorValue();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | Error>(null);
    const [resolvedValue, setResolvedValue] = React.useState<null | INodePartialForTree>(null);
    const siteNodeContextPath = useSiteNodeContextPath();

    React.useEffect(() => {
        if (value?.href) {
            if (cache.has(value.href)) {
                setResolvedValue(cache.get(value.href)!);
                return;
            }

            const match = /node:\/\/(.*)/.exec(value.href);
            if (match) {
                const identifier = match[1];

                (async () => {
                    if (siteNodeContextPath) {
                        setLoading(true);
                        try {
                            const result = await q(siteNodeContextPath).find(`#${identifier}`)
                                .getForTree();
                            for (const node of result) {
                                cache.set(value.href, node);
                                setResolvedValue(node);
                                setLoading(false);
                                break;
                            }
                        } catch (err) {
                            setError(err);
                            setLoading(false);
                        }
                    }
                })();
            }
        }
    }, [value, siteNodeContextPath]);

    return {
        loading,
        error,
        resolvedValue
    };
}

export const NodeTree = new class extends LinkType {
    public readonly id = 'Sitegeist.Archaeopteryx:NodeTree';

    public readonly isSuitableFor = (props: ILinkTypeProps) => {
        return Boolean(props.link?.href.startsWith('node://'));
    }

    public readonly getIcon = () => (
        <div>NODE TREE</div>
    );

    public readonly getTitle = () => 'Node Tree';

    public readonly getPreview = () => (
        <div>NODE TREE PREVIEW</div>
    );

    public readonly getEditor = () => {
        const {loading, error, resolvedValue} = useResolvedValue();
        const {update} = useEditorTransactions();
        const siteNodeContextPath = useSiteNodeContextPath();
        const documentNodeContextPath = useDocumentNodeContextPath();
        const baseNodeTypeName = useBaseNodeTypeName();
        const loadingDepth = useConfiguration(c => c.nodeTree?.loadingDepth) ?? 4;

        if (loading || !siteNodeContextPath || !documentNodeContextPath) {
            return (
                <div>Loading...</div>
            );
        } else if (error) {
            console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
            console.error(error);
            return (
                <div>An error occurred :(</div>
            );
        } else {
            return (
                <NodeTreeAdapter
                    configuration={{
                        baseNodeTypeName,
                        rootNodeContextPath: siteNodeContextPath,
                        documentNodeContextPath,
                        selectedNodeContextPath: resolvedValue?.contextPath,
                        loadingDepth
                    }}
                    options={{
                        enableSearch: true,
                        enableNodeTypeFilter: true
                    }}
                    onSelect={node =>{
                        cache.set(`node://${node.identifier}`, node);
                        update({href: `node://${node.identifier}`});
                    }}
                />
            );
        }
    };
}
