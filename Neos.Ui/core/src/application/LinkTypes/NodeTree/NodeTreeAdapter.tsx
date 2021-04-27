import * as React from 'react';
import {produce} from 'immer';

import {Tree} from '@neos-project/react-ui-components';
import backend from '@neos-project/neos-ui-backend-connector';
import {useNeos} from '../../../acl';

interface ITreeState {
    nodesByContextPath: {
        [contextPath: string]: INode
    }
    rootNodeContextPath: null | string
    open: string[]
    loading: string[]
}

interface INode {
    identifier: string
    contextPath: string
    nodeType: string
    label: string
    children: {
        contextPath: string
        nodeType: string
    }[]
}

interface INodeType {
    ui?: {
        icon?: string
    }
}

function adoptStartingPoint(startingPoint?: string, referenceNode?: string): null | string {
    const [startingPointPath] = (startingPoint ?? '').split('@');
    const [referenceNodePath, referenceNodeContext] = (referenceNode ?? '').split('@');

    if (startingPointPath && referenceNodePath && referenceNodeContext) {
        return `${startingPointPath}@${referenceNodeContext}`;
    } else if (referenceNodePath && referenceNodeContext) {
        return `${referenceNodePath}@${referenceNodeContext}`;
    } else {
        return null;
    }
}

function useOperation() {
    const ids = React.useRef(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | Error>(null);

    function start() {
        const id = ids.current++;
        setLoading(true);
    }

    function fail(reason: Error) {
        setError(reason);
        setLoading(false);
    }

    function succeed() {
        setLoading(false);
    }

    return {loading, error, start, fail, succeed};
}

function useTree(startingPoint?: string) {
    const neos = useNeos();
    const initialization = useOperation();
    const [treeState, setTreeState] = React.useState<ITreeState>({
        nodesByContextPath: {},
        rootNodeContextPath: null,
        open: [],
        loading: []
    });

    const toggle = React.useCallback(async (contextPath: string) => {
        if (treeState.open.includes(contextPath)) {
            setTreeState(treeState => produce(treeState, draft => {
                for (const [index, c] of treeState.open.entries()) {
                    if (c === contextPath) {
                        draft.open.slice(index, 1);
                        break;
                    }
                }
            }));
        } else {
            const node = treeState.nodesByContextPath[contextPath];
            if (node) {
                if (node.children.every(c => Boolean(treeState.nodesByContextPath[c.contextPath]))) {
                    setTreeState(treeState => produce(treeState, draft => {
                        draft.open.push(contextPath);
                    }));
                } else {
                    const {q} = backend.get();
                    const children = node.children
                        .filter(c => !Boolean(treeState.nodesByContextPath[c.contextPath]))
                        .map(c => c.contextPath);
                    const nodes = await q(children).getForTree();

                    setTreeState(treeState => produce(treeState, draft => {
                        for (const node of nodes) {
                            draft.nodesByContextPath[node.contextPath] = node;
                        }
                        draft.open.push(contextPath);
                    }));
                }
            }
        }

    }, [treeState]);

    React.useEffect(() => {
        (async () => {
            const siteNode = neos?.store.getState()?.cr?.nodes?.siteNode;
            const root = adoptStartingPoint(startingPoint, siteNode);
            if (root) {
                const {q} = backend.get();
                const documentNode = neos?.store.getState()?.cr?.nodes?.documentNode;

                initialization.start();

                try {
                    const nodes = await q([root, documentNode]).neosUiDefaultNodes(
                        neos?.configuration?.nodeTree?.presets?.default?.baseNodeType ?? 'Neos.Neos:Document',
                        neos?.configuration?.nodeTree?.loadingDepth ?? 4,
                        [],
                        []
                    ).getForTree();

                    setTreeState(produce(treeState, draft => {
                        for (const node of nodes) {
                            draft.nodesByContextPath[node.contextPath] = node;
                        }
                        draft.rootNodeContextPath = root;
                    }));

                    initialization.succeed();
                } catch (err) {
                    initialization.fail(err);
                }
            }
        })();
    }, [neos]);

    return {
        treeState,
        toggle,
        loading: initialization.loading,
        error: initialization.error
    };
}

export const NodeTreeAdapter: React.FC = () => {
    const {loading, error, treeState, toggle} = useTree();
    const handleToggle = React.useCallback((node: INode) => {
        toggle(node.contextPath);
    }, [toggle]);
    const handleClick = React.useCallback((node: INode) => {
        toggle(node.contextPath);
    }, [toggle]);

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
        const rootNode = treeState.nodesByContextPath[treeState.rootNodeContextPath ?? ''];
        if (rootNode) {
            return (
                <Tree>
                    <NodeAdapter
                        node={rootNode}
                        tree={treeState}
                        onToggle={handleToggle}
                        onClick={handleClick}
                        />
                </Tree>
            )
        } else {
            return null;
        }
    }
};

function useNodeType(nodeTypeName: string) {
    const neos = useNeos();
    const nodeTypesRegistry = neos?.globalRegistry.get('@neos-project/neos-ui-contentrepository');
    return nodeTypesRegistry?.get(nodeTypeName) as INodeType | null ?? null;
}

interface NodeAdapterProps {
    node: INode
    tree: ITreeState
    onToggle: (node: INode) => any
    onClick: (node: INode) => any
}

const NodeAdapter: React.FC<NodeAdapterProps> = props => {
    const nodeType = useNodeType(props.node.nodeType);

    console.log('nodeType', nodeType);

    const handleNodeToggle = React.useCallback(() => {
        props.onToggle(props.node);
    }, [props.node]);
    const handleNodeClick = React.useCallback(() => {
        props.onClick(props.node);
    }, [props.node]);

    return (
        <Tree.Node>
            <Tree.Node.Header
                labelIdentifier={'labelIdentifier'}
                id={props.node.contextPath}
                hasChildren={props.node.children.length > 0}
                nodeDndType={undefined}
                isLastChild={true}
                isCollapsed={!props.tree.open.includes(props.node.contextPath)}
                isActive={false}
                isFocused={false}
                isLoading={false}
                isDirty={false}
                isHidden={"$get('properties._hidden', node)"}
                isHiddenInIndex={"$get('properties._hiddenInIndex', node) || this.isIntermediate()"}
                isDragging={false}
                hasError={false}
                label={props.node.label}
                icon={nodeType?.ui?.icon}
                customIconComponent={undefined}
                iconLabel={'this.getNodeTypeLabel()'}
                level={1}
                onToggle={handleNodeToggle}
                onClick={handleNodeClick}
                dragAndDropContext={undefined}
                dragForbidden={true}
                title={props.node.label}
            />
        </Tree.Node>
    );
};