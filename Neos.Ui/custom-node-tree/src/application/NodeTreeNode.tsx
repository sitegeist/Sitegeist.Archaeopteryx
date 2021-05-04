import * as React from 'react';

import {Tree} from '@neos-project/react-ui-components';
import {INodePartialForTree, useNodeType} from '@sitegeist/archaeopteryx-neos-bridge';

import {INodeTreeState, isNodeCollapsed, isNodeLoading, findChildNodesForNode, NodeTreeDispatch} from '../domain';

interface Props {
    state: INodeTreeState
    dispatch: NodeTreeDispatch
    node: INodePartialForTree
    selectedNode: null | INodePartialForTree
    level: number
    onToggle: (node: INodePartialForTree) => any
    onClick: (node: INodePartialForTree) => any
}

export const NodeTreeNode: React.FC<Props> = props => {
    const nodeType = useNodeType(props.node.nodeType);
    const handleNodeToggle = React.useMemo(
        () => () => props.onToggle(props.node),
        [props.onToggle, props.node]
    );
    const handleNodeClick = React.useMemo(
        () => () => props.onClick(props.node),
        [props.onToggle, props.node]
    );
    const isCollapsed = React.useMemo(
        () => isNodeCollapsed(props.state, props.node),
        [props.state.nodesByState.uncollapsed, props.node]
    );
    const isLoading = React.useMemo(
        () => isNodeLoading(props.state, props.node),
        [props.state.nodesByState.loading, props.node]
    );
    const isSelected = React.useMemo(
        () => !props.selectedNode || props.node.contextPath.equals(props.selectedNode.contextPath),
        [props.node, props.selectedNode]
    );

    return (
        <Tree.Node>
            <Tree.Node.Header
                labelIdentifier={'labelIdentifier'}
                id={props.node.contextPath}
                hasChildren={props.node.children.length > 0}
                isLastChild={true}
                isCollapsed={isCollapsed}
                isActive={isSelected}
                isFocused={isSelected}
                isLoading={isLoading}
                isDirty={false}
                isHidden={props.node.properties._hidden}
                isHiddenInIndex={props.node.properties._hiddenInIndex}
                isDragging={false}
                hasError={false}
                label={props.node.label}
                icon={nodeType?.ui?.icon}
                iconLabel={nodeType?.label}
                level={props.level}
                onToggle={handleNodeToggle}
                onClick={handleNodeClick}
                dragForbidden={true}
                title={props.node.label}
            />
            {isCollapsed
                ? null
                : findChildNodesForNode(props.state, props.node).map(childNode => (
                    <NodeTreeNode
                        {...props}
                        node={childNode}
                        level={props.level + 1}
                    />
                ))
            }
        </Tree.Node>
    );
};