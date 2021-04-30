import * as React from 'react';

import backend from '@neos-project/neos-ui-backend-connector';

import {useNeos} from '../../../acl';
import {LinkType, ILinkTypeProps, useEditorTransactions, useEditorValue} from '../../../domain';
import {INode, NodeTreeAdapter} from './NodeTreeAdapter';

function useResolvedValue() {
    const neos = useNeos();
    const {value} = useEditorValue();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | Error>(null);
    const [resolvedValue, setResolvedValue] = React.useState<null | INode>(null);

    React.useEffect(() => {
        if (value?.href) {
            const match = /node:\/\/(.*)/.exec(value.href);
            if (match) {
                const siteNode = neos?.store.getState()?.cr?.nodes?.siteNode;
                const {q} = backend.get();
                const identifier = match[1];

                (async () => {
                    setLoading(true);
                    try {
                        const result = await q(siteNode).find(`#${identifier}`).getForTree();
                        for (const node of result) {
                            setResolvedValue(node);
                            setLoading(false);
                            break;
                        }
                    } catch (err) {
                        setError(err);
                        setLoading(false);
                    }
                })();
            }
        }
    }, [value]);

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

        if (loading) {
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
                    selected={resolvedValue}
                    onSelect={node => update({href: `node://${node.identifier}`})}
                    />
            );
        }
    };
}
