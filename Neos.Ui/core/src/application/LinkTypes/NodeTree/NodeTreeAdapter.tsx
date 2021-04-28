import * as React from 'react';
import {produce} from 'immer';
import {useDebounce} from 'react-use';

import {Tree} from '@neos-project/react-ui-components';
import backend from '@neos-project/neos-ui-backend-connector';
import {useNeos} from '../../../acl';

interface ITreeState {
    nodesByContextPath: {
        [contextPath: string]: INode
    }
    filteredNodesByContextPath: null | {
        [contextPath: string]: INode
    }
    searchTerm: null | string
    nodeTypeFilter: null | string
    rootNodeContextPath: null | string
    open: string[]
    loading: string[]
}

export interface INode {
    identifier: string
    contextPath: string
    nodeType: string
    label: string
    depth: number
    children: {
        contextPath: string
        nodeType: string
    }[]
    properties: {
        _hidden: boolean
        _hiddenInIndex: boolean
    }
}

function adoptContextPath(startingPoint?: string, referenceNode?: string): null | string {
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

function resolveRootLine(rootContextPath?: string, leafContextPath?: string): string[] {
    const [rootPath, rootContext] = (rootContextPath ?? '').split('@');
    const [leafPath, leafContext] = (leafContextPath ?? '').split('@');

    console.log({
        rootPath, rootContext,
        leafPath, leafContext
    });

    if (rootPath && rootContext && leafPath && leafContext && leafPath.startsWith(rootPath)) {
        const segments = leafPath.split('/');
        const result = [];

        for (const [index] of segments.entries()) {
            const path = segments.slice(0, -index).join('/');
            if (path) {
                console.log({path});
                result.push(`${path}@${rootContext}`);
            }


            if (path === rootPath) {
                break;
            }
        }

        return result;
    } else {
        return [];
    }
}

function useOperation() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | Error>(null);

    function start() {
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

function useTree(startingPoint?: string, selectedPath?: string) {
    const neos = useNeos();
    const initialization = useOperation();
    const [treeState, setTreeState] = React.useState<ITreeState>({
        nodesByContextPath: {},
        filteredNodesByContextPath: null,
        searchTerm: null,
        nodeTypeFilter: null,
        rootNodeContextPath: null,
        open: [],
        loading: []
    });
    const baseNodeType = neos?.configuration?.nodeTree?.presets?.default?.baseNodeType ?? 'Neos.Neos:Document';
    const loadingDepth = neos?.configuration?.nodeTree?.loadingDepth ?? 4;

    const filterNodes = (nodes: INode[]) => nodes.map((node: INode) => ({
        ...node,
        children: node.children.filter(({nodeType: nodeTypeName}) => {
            const nodeTypesRegistry = neos?.globalRegistry.get('@neos-project/neos-ui-contentrepository');
            return Boolean(nodeTypesRegistry?.isOfType(nodeTypeName, baseNodeType));
        })
    }));

    const markAsLoading = (contextPath: string) => {
        setTreeState(treeState => produce(treeState, draft => {
            draft.loading.push(contextPath);
        }));
    };

    const unmarkAsLoading = (contextPath: string) => {
        setTreeState(treeState => produce(treeState, draft => {
            for (const [index, c] of treeState.loading.entries()) {
                if (c === contextPath) {
                    draft.loading.splice(index, 1);
                    break;
                }
            }
        }));
    };

    const toggle = async (contextPath: string) => {
        if (treeState.open.includes(contextPath)) {
            setTreeState(treeState => produce(treeState, draft => {
                for (const [index, c] of treeState.open.entries()) {
                    if (c === contextPath) {
                        draft.open.splice(index, 1);
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

                    markAsLoading(node.contextPath);

                    const nodes = await q(children).getForTree();

                    setTreeState(treeState => produce(treeState, draft => {
                        for (const node of filterNodes(nodes)) {
                            draft.nodesByContextPath[node.contextPath] = node;
                        }
                        draft.open.push(contextPath);
                    }));

                    unmarkAsLoading(node.contextPath);
                }
            }
        }
    };

    const search = (searchTerm: null | string) => {
        setTreeState(treeState => produce(treeState, draft => {
            draft.searchTerm = searchTerm;
        }));
    };

    React.useEffect(() => {
        (async () => {
            const siteNode = neos?.store.getState()?.cr?.nodes?.siteNode;
            const root = adoptContextPath(startingPoint, siteNode);
            const offset = root?.match(/\//g)?.length ?? 0;

            if (root) {
                const {q} = backend.get();
                const documentNode = neos?.store.getState()?.cr?.nodes?.documentNode;
                const selected = adoptContextPath(selectedPath, documentNode);
                const toggled = resolveRootLine(root, selectedPath);

                initialization.start();

                try {
                    const nodes = await q([root, selected]).neosUiDefaultNodes(
                        baseNodeType,
                        loadingDepth,
                        toggled,
                        []
                    ).getForTree();

                    setTreeState(produce(treeState, draft => {
                        for (const node of filterNodes(nodes)) {
                            draft.nodesByContextPath[node.contextPath] = node;

                            if (toggled.includes(node.contextPath) || node.depth - offset <= loadingDepth) {
                                draft.open.push(node.contextPath);
                            }
                        }
                        draft.rootNodeContextPath = root;
                    }));

                    initialization.succeed();
                } catch (err) {
                    initialization.fail(err);
                }
            }
        })();
    }, [neos, startingPoint, selectedPath]);

    useDebounce(() => {
        const siteNode = neos?.store.getState()?.cr?.nodes?.siteNode;
        const root = adoptContextPath(startingPoint, siteNode);

        if (root && (treeState.searchTerm || treeState.nodeTypeFilter)) {
            (async () => {
                console.log('search', treeState.searchTerm);
                const {q} = backend.get();

                initialization.start();
                try {
                    const nodes = await q(root).search(treeState.searchTerm, treeState.nodeTypeFilter)
                        .getForTreeWithParents();

                    setTreeState(produce(treeState, draft => {
                        draft.filteredNodesByContextPath = {};
                        for (const node of filterNodes(nodes)) {
                            draft.filteredNodesByContextPath[node.contextPath] = node;
                        }
                    }));

                    initialization.succeed();
                } catch (err) {
                    initialization.fail(err);
                }
            })();
        } else {
            setTreeState(produce(treeState, draft => {
                draft.filteredNodesByContextPath = null;
            }));
        }
    }, 500, [neos, startingPoint, selectedPath, treeState.searchTerm, treeState.nodeTypeFilter]);

    return {
        treeState: {
            ...treeState,
            nodesByContextPath: treeState.filteredNodesByContextPath
                ?? treeState.nodesByContextPath
        },
        toggle,
        search,
        loading: initialization.loading,
        error: initialization.error
    };
}

interface Props {
    selected: null | INode
    onSelect: (node: INode) => void
}

export const NodeTreeAdapter: React.FC<Props> = props => {
    const {loading, error, treeState, toggle, search} = useTree(undefined, props.selected?.contextPath);
    const handleToggle = (node: INode) => toggle(node.contextPath);
    const handleClick = (node: INode) => props.onSelect(node);

    let treeView;
    if (loading) {
        treeView = (
            <div>Loading...</div>
        );
    } else if (error) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
        console.error(error);
        treeView = (
            <div>An error occurred :(</div>
        );
    } else {
        const rootNode = treeState.nodesByContextPath[treeState.rootNodeContextPath ?? ''];
        if (rootNode) {
            treeView = (
                <Tree>
                    <NodeAdapter
                        selected={props.selected}
                        node={rootNode}
                        tree={treeState}
                        level={1}
                        onToggle={handleToggle}
                        onClick={handleClick}
                        />
                </Tree>
            )
        } else {
            treeView = null;
        }
    }

    return (
        <>
            <input
                type="text"
                onChange={ev => search(ev.target.value || null)}
                value={treeState.searchTerm ?? ''}
                />
            {treeView}
        </>
    )
};

function useNodeType(nodeTypeName: string) {
    const neos = useNeos();
    const nodeTypesRegistry = neos?.globalRegistry.get('@neos-project/neos-ui-contentrepository');
        return nodeTypesRegistry?.get(nodeTypeName) ?? null;
}

interface NodeAdapterProps {
    selected: null | INode
    node: INode
    tree: ITreeState
    level: number
    onToggle: (node: INode) => any
    onClick: (node: INode) => any
}

const NodeAdapter: React.FC<NodeAdapterProps> = props => {
    const nodeType = useNodeType(props.node.nodeType);
    const handleNodeToggle = () => props.onToggle(props.node);
    const handleNodeClick = () => props.onClick(props.node);
    const isCollapsed = !props.tree.open.includes(props.node.contextPath);

    console.log('node', props.node);

    return (
        <Tree.Node>
            <Tree.Node.Header
                labelIdentifier={'labelIdentifier'}
                id={props.node.contextPath}
                hasChildren={props.node.children.length > 0}
                nodeDndType={undefined}
                isLastChild={true}
                isCollapsed={isCollapsed}
                isActive={props.selected?.contextPath === props.node.contextPath}
                isFocused={props.selected?.contextPath === props.node.contextPath}
                isLoading={props.tree.loading.includes(props.node.contextPath)}
                isDirty={false}
                isHidden={props.node.properties._hidden}
                isHiddenInIndex={props.node.properties._hiddenInIndex}
                isDragging={false}
                hasError={false}
                label={props.node.label}
                icon={nodeType?.ui?.icon}
                customIconComponent={undefined}
                iconLabel={'this.getNodeTypeLabel()'}
                level={props.level}
                onToggle={handleNodeToggle}
                onClick={handleNodeClick}
                dragAndDropContext={undefined}
                dragForbidden={true}
                title={props.node.label}
            />
            {isCollapsed ? null : props.node.children
                .map(child => props.tree.nodesByContextPath[child.contextPath])
                .filter(n => n)
                .map(node => (
                    <NodeAdapter
                        {...props}
                        node={node}
                        level={props.level + 1}
                    />
                ))
            }
        </Tree.Node>
    );
};