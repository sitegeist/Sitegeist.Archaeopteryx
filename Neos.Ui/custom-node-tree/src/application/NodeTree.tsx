import * as React from 'react';
import {useAsync} from 'react-use';

import {Tree} from '@neos-project/react-ui-components';
import {INodePartialForTree, NodeTypeName, ContextPath, useNodeTypesRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {findNodeByContextPath, initialNodeTreeState, loadNodeTree, nodeTreeReducer, toggleNodeInNodeTree} from '../domain';

import {NodeTreeNode} from './NodeTreeNode';

interface Props {
    configuration: {
        rootNodeContextPath: ContextPath,
        baseNodeTypeName: NodeTypeName,
        loadingDepth: number,
        documentNodeContextPath: ContextPath,
        selectedNodeContextPath?: ContextPath
    }
    options?: {
        enableSearch?: boolean
        enableNodeTypeFilter?: boolean
    }
    onSelect(node: INodePartialForTree): void
}

export const NodeTree: React.FC<Props> = props => {
    const nodeTypesRegistry = useNodeTypesRegistry();
    const [state, dispatch] = React.useReducer(
        nodeTreeReducer,
        initialNodeTreeState
    );
    const initialize = useAsync(
        async () => {
            if (nodeTypesRegistry) {
                await loadNodeTree({state, dispatch}, nodeTypesRegistry, props.configuration);
            }
        },
        [props.configuration, nodeTypesRegistry]
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
        search = (<>SEARCH</>);
    }

    let nodeTypeFilter = null;
    if (props.options?.enableNodeTypeFilter) {
        nodeTypeFilter = (<>NODE TYPE FILTER</>);
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '4px'
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
                        gridColumn: '1 / span 2'
                    }}
                    >
                    {main}
                </div>
            ) : null}
        </div>
    );
}