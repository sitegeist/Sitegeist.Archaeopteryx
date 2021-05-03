import * as React from 'react';
import {produce} from 'immer';
import {useDebounce} from 'react-use';
import {useWhatChanged} from '@simbathesailor/use-what-changed';

import {Tree} from '@neos-project/react-ui-components';
import {
    q,
    ContextPath,
    NodeTypeName,
    useSiteNodeContextPath,
    useDocumentNodeContextPath,
    useNodeType,
    useNodeTypes,
    useNodeTypesRegistry,
    useConfiguration,
    INodePartialForTree,
    INodeType
} from '@sitegeist/archaeopteryx-neos-bridge';

interface ITreeState {
    nodesByContextPath: {
        [contextPath: string]: INodePartialForTree
    }
    filteredNodesByContextPath: null | {
        [contextPath: string]: INodePartialForTree
    }
    searchTerm: null | string
    nodeTypeFilter: null | NodeTypeName
    rootNodeContextPath: null | ContextPath
    open: string[]
    loading: string[]
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

function useBaseNodeTypeName(): NodeTypeName {
    const baseNodeTypeName = useConfiguration(c => c.nodeTree?.presets?.default?.baseNodeType);
    return baseNodeTypeName ?? NodeTypeName('Neos.Neos:Document');
}

function useTree(startingPoint?: string, selectedPath?: string) {
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
    const siteNodeContextPath = useSiteNodeContextPath();
    const documentNodeContextPath = useDocumentNodeContextPath();
    const baseNodeTypeName = useBaseNodeTypeName();
    const loadingDepth = useConfiguration(c => c.nodeTree?.loadingDepth) ?? 4;
    const nodeTypesRegistry = useNodeTypesRegistry();

    const filterNodes = (nodes: INodePartialForTree[]) => nodes.map((node: INodePartialForTree) => ({
        ...node,
        children: node.children.filter(({nodeType: nodeTypeName}) => {
            return Boolean(nodeTypesRegistry?.isOfType(nodeTypeName, baseNodeTypeName));
        })
    }));

    const markAsLoading = (node: INodePartialForTree) => {
        setTreeState(treeState => produce(treeState, draft => {
            draft.loading.push(node.contextPath.toString());
        }));
    };

    const unmarkAsLoading = (node: INodePartialForTree) => {
        setTreeState(treeState => produce(treeState, draft => {
            for (const [index, c] of treeState.loading.entries()) {
                if (c === node.contextPath.toString()) {
                    draft.loading.splice(index, 1);
                    break;
                }
            }
        }));
    };

    const toggle = async (node: INodePartialForTree) => {
        if (treeState.open.includes(node.contextPath.toString())) {
            setTreeState(treeState => produce(treeState, draft => {
                for (const [index, c] of treeState.open.entries()) {
                    if (c === node.contextPath.toString()) {
                        draft.open.splice(index, 1);
                        break;
                    }
                }
            }));
        } else {
            if (node.children.every(c => Boolean(treeState.nodesByContextPath[c.contextPath.toString()]))) {
                setTreeState(treeState => produce(treeState, draft => {
                    draft.open.push(node.contextPath.toString());
                }));
            } else {
                const children = node.children
                    .filter(c => !Boolean(treeState.nodesByContextPath[c.contextPath.toString()]))
                    .map(c => c.contextPath);

                markAsLoading(node);

                const nodes = await q(children).getForTree();

                setTreeState(treeState => produce(treeState, draft => {
                    for (const node of filterNodes(nodes)) {
                        draft.nodesByContextPath[node.contextPath.toString()] = node;
                    }
                    draft.open.push(node.contextPath.toString());
                }));

                unmarkAsLoading(node);
            }
        }
    };

    const search = (searchTerm: null | string) => {
        setTreeState(treeState => produce(treeState, draft => {
            draft.searchTerm = searchTerm;
        }));
    };

    const filter = (nodeTypeName: null | NodeTypeName) => {
        setTreeState(treeState => produce(treeState, draft => {
            draft.nodeTypeFilter = nodeTypeName;
        }));
    };

    React.useEffect(() => {
        (async () => {
            const root = siteNodeContextPath?.adopt(startingPoint) ?? siteNodeContextPath;

            if (root && documentNodeContextPath) {
                const selected = documentNodeContextPath?.adopt(selectedPath);
                const toggled = root.getIntermediateContextPaths(selected ?? documentNodeContextPath);

                initialization.start();

                try {
                    const nodes = await q([root, selected ?? documentNodeContextPath]).neosUiDefaultNodes(
                        baseNodeTypeName,
                        loadingDepth,
                        toggled,
                        []
                    ).getForTree();

                    setTreeState(produce(treeState, draft => {
                        for (const node of filterNodes(nodes)) {
                            draft.nodesByContextPath[node.contextPath.toString()] = node;

                            if (toggled.includes(node.contextPath) || node.depth - root.depth < loadingDepth) {
                                draft.open.push(node.contextPath.toString());
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
    }, [siteNodeContextPath, documentNodeContextPath, startingPoint]);

    useDebounce(() => {
        const root = siteNodeContextPath?.adopt(startingPoint);

        (async () => {
            if (root && (treeState.searchTerm || treeState.nodeTypeFilter)) {
                initialization.start();
                try {
                    const nodes = await q(root)
                        .search(treeState.searchTerm ?? undefined, treeState.nodeTypeFilter ?? undefined)
                        .getForTreeWithParents();

                    setTreeState(produce(treeState, draft => {
                        draft.filteredNodesByContextPath = {};

                        if (treeState.rootNodeContextPath) {
                            draft.filteredNodesByContextPath[treeState.rootNodeContextPath.toString()] =
                                treeState.nodesByContextPath[treeState.rootNodeContextPath.toString()];
                        }

                        for (const node of filterNodes(nodes)) {
                            draft.filteredNodesByContextPath[node.contextPath.toString()] = node;
                        }
                    }));

                    initialization.succeed();
                } catch (err) {
                    initialization.fail(err);
                }
            } else {
                setTreeState(produce(treeState, draft => {
                    draft.filteredNodesByContextPath = null;
                }));
            }
        })();
    }, 500, [siteNodeContextPath, startingPoint, treeState.searchTerm, treeState.nodeTypeFilter]);

    return {
        treeState: {
            ...treeState,
            nodesByContextPath: treeState.filteredNodesByContextPath
                ?? treeState.nodesByContextPath
        },
        toggle,
        search,
        filter,
        isFiltered: Boolean(treeState.filteredNodesByContextPath),
        loading: initialization.loading,
        error: initialization.error
    };
}

interface Props {
    selected: null | INodePartialForTree
    onSelect: (node: INodePartialForTree) => void
}

export const NodeTreeAdapter: React.FC<Props> = props => {
    const {loading, error, treeState, toggle, search, filter, isFiltered} = useTree(undefined, props.selected?.contextPath.toString());
    const handleToggle = (node: INodePartialForTree) => toggle(node);
    const handleClick = (node: INodePartialForTree) => props.onSelect(node);

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
        const rootNode = treeState.nodesByContextPath[treeState.rootNodeContextPath?.toString() ?? ''];
        if (rootNode) {
            treeView = (
                <Tree>
                    <NodeAdapter
                        selected={props.selected}
                        node={rootNode}
                        tree={treeState}
                        level={1}
                        isFiltered={isFiltered}
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
            <NodeTypeFilter
                value={treeState.nodeTypeFilter}
                onSelect={nodeType => filter(nodeType?.name ?? null)}
                />
            {treeView}
        </>
    )
};

interface NodeAdapterProps {
    selected: null | INodePartialForTree
    node: INodePartialForTree
    tree: ITreeState
    level: number
    isFiltered: boolean
    onToggle: (node: INodePartialForTree) => any
    onClick: (node: INodePartialForTree) => any
}

const NodeAdapter: React.FC<NodeAdapterProps> = props => {
    const nodeType = useNodeType(props.node.nodeType);
    const handleNodeToggle = () => props.onToggle(props.node);
    const handleNodeClick = () => props.onClick(props.node);
    const isCollapsed = !props.tree.open.includes(props.node.contextPath.toString()) && !props.isFiltered;
    const isLoading = props.tree.loading.includes(props.node.contextPath.toString());

    return (
        <Tree.Node>
            <Tree.Node.Header
                labelIdentifier={'labelIdentifier'}
                id={props.node.contextPath}
                hasChildren={props.node.children.length > 0}
                nodeDndType={undefined}
                isLastChild={true}
                isCollapsed={isCollapsed}
                isActive={props.selected?.contextPath.toString() === props.node.contextPath.toString()}
                isFocused={props.selected?.contextPath.toString() === props.node.contextPath.toString()}
                isLoading={isLoading}
                isDirty={false}
                isHidden={props.node.properties._hidden}
                isHiddenInIndex={props.node.properties._hiddenInIndex}
                isDragging={false}
                hasError={false}
                label={props.node.label}
                icon={nodeType?.ui?.icon}
                customIconComponent={undefined}
                iconLabel={nodeType?.label}
                level={props.level}
                onToggle={handleNodeToggle}
                onClick={handleNodeClick}
                dragAndDropContext={undefined}
                dragForbidden={true}
                title={props.node.label}
            />
            {isCollapsed ? null : props.node.children
                .map(child => props.tree.nodesByContextPath[child.contextPath.toString()])
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

interface NodeTypeFilterProps {
    value: null | string
    onSelect: (nodeType: null | INodeType) => void
}

const NodeTypeFilter: React.FC<NodeTypeFilterProps> = props => {
    const baseNodeTypeName = useBaseNodeTypeName();
    const selectableNodeTypes = useNodeTypes(baseNodeTypeName);
    const handleChange = React.useCallback((ev: React.SyntheticEvent) => {
        const nodeType = selectableNodeTypes?.find(nodeType => nodeType.name === (ev.target as HTMLSelectElement).value);

        props.onSelect(nodeType ?? null);
    }, [selectableNodeTypes, props.onSelect]);

    return (
        <select value={props.value ?? ''} onChange={handleChange}>
            <option value="">- None -</option>
            {selectableNodeTypes.map(nodeType => (
                <option value={nodeType.name}>
                    {nodeType.label}
                </option>
            ))}
        </select>
    );
}