import * as React from 'react';
import {useAsync} from 'react-use';

import {Tree} from '@neos-project/react-ui-components';
import {
    INodePartialForTree,
    NodeTypeName,
    ContextPath,
    useHasNode,
    useNodeTypesRegistry,
    useDocumentNodeContextPath,
    useSiteNodeContextPath,
    useConfiguration,
    useNeos
} from '@sitegeist/archaeopteryx-neos-bridge';

import {findNodeByContextPath, initialNodeTreeState, loadNodeTreeFromUiState, loadNodeTree, nodeTreeReducer, toggleNodeInNodeTree} from '../domain';

import {NodeTreeNode} from './NodeTreeNode';
import {Search} from './Search';
import {NodeTypeFilter} from './NodeTypeFilter';

interface Props {
    configuration: Configuration
    options?: {
        enableSearch?: boolean
        enableNodeTypeFilter?: boolean
    }
    onSelect(node: INodePartialForTree): void
}

interface Configuration {
    rootNodeContextPath: ContextPath
    baseNodeTypeName: NodeTypeName
    loadingDepth: number
    documentNodeContextPath: ContextPath
    selectedNodeContextPath?: ContextPath
}

function useCanBeLoadedFromUiState(configuration: Configuration) {
    const siteNodeContextPath = useSiteNodeContextPath();
    const documentNodeContextPath = useDocumentNodeContextPath();
    const baseNodeTypeName = useConfiguration(c => c.nodeTree?.presets?.default?.baseNodeType);
    const loadingDepth = useConfiguration(c => c.nodeTree?.loadingDepth);
    const hasSelectedNode = useHasNode(configuration.selectedNodeContextPath);

    return hasSelectedNode
        && siteNodeContextPath
        && configuration.rootNodeContextPath.equals(siteNodeContextPath)
        && documentNodeContextPath
        && configuration.documentNodeContextPath.equals(documentNodeContextPath)
        && configuration.baseNodeTypeName === baseNodeTypeName
        && configuration.loadingDepth === loadingDepth
    ;
}

export const NodeTree: React.FC<Props> = props => {
    const neos = useNeos();
    const nodeTypesRegistry = useNodeTypesRegistry();
    const [state, dispatch] = React.useReducer(
        nodeTreeReducer,
        initialNodeTreeState
    );
    const canbeLoadedFromUiState = useCanBeLoadedFromUiState(props.configuration);
    const initialize = useAsync(
        async () => {
            if (canbeLoadedFromUiState) {
                await loadNodeTreeFromUiState({state, dispatch}, nodeTypesRegistry, neos, props.configuration);
            } else {
                await loadNodeTree({state, dispatch}, nodeTypesRegistry, props.configuration);
            }
        },
        [
            neos,
            canbeLoadedFromUiState,
            props.configuration.baseNodeTypeName,
            props.configuration.rootNodeContextPath
        ]
    );
    const selectedNode = React.useMemo(
        () => props.configuration.selectedNodeContextPath
            ? findNodeByContextPath(state, props.configuration.selectedNodeContextPath)
            : null,
        [props.configuration, state.nodesByContextPath]
    );
    const handleToggle = React.useCallback(
        (node: INodePartialForTree) => {
            if (nodeTypesRegistry) {
                toggleNodeInNodeTree({state, dispatch}, nodeTypesRegistry, node);
            }
        },
        [state.nodesByContextPath, state.nodesByState.uncollapsed, nodeTypesRegistry, dispatch]
    );
    const handleClick = (node: INodePartialForTree) => props.onSelect(node);

    let main;
    if (initialize.error) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
        console.error(initialize.error);
        main = (<div>An error occurred :(</div>);
    } else if (initialize.loading || !state.rootNode) {
        main = (<div>Loading...</div>);
    } else {
        main = (
            <Tree>
                <NodeTreeNode
                    state={state}
                    dispatch={dispatch}
                    node={state.rootNode}
                    selectedNode={selectedNode}
                    level={1}
                    onToggle={handleToggle}
                    onClick={handleClick}
                />
            </Tree>
        );
    }

    let search = null;
    if (props.options?.enableSearch) {
        search = (
            <Search
                state={state}
                dispatch={dispatch}
                initialValue=""
            />
        );
    }

    let nodeTypeFilter = null;
    if (props.options?.enableNodeTypeFilter) {
        nodeTypeFilter = (
            <NodeTypeFilter
                state={state}
                dispatch={dispatch}
                initialValue=""
            />
        );
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                backgroundColor: '#141414',
                border: '1px solid #3f3f3f'
            }}
            >
            {search ? (
                <div
                    style={{
                        gridColumn: nodeTypeFilter
                            ? '1 / span 1'
                            : '1 / span 2'
                    }}
                    >
                    {search}
                </div>
            ) : null}
            {nodeTypeFilter ? (
                <div
                    style={{
                        gridColumn: search
                            ? '2 / span 1'
                            : '1 / span 2'
                    }}
                    >
                    {nodeTypeFilter}
                </div>
            ) : null}
            {main ? (
                <div
                    style={{
                        marginTop: '-5px',
                        borderTop: '1px solid #3f3f3f',
                        gridColumn: '1 / span 2',
                        height: '50vh',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                    >
                    {main}
                </div>
            ) : null}
        </div>
    );
}