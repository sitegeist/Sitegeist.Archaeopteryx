import * as React from 'react';

import {Tree} from '@neos-project/react-ui-components';
import {INodePartialForTree, NodeTypeName, useNodeType, useNodeTypesRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {INodeTreeState, isNodeCollapsed, isNodeLoading, findChildNodesForNode, NodeTreeDispatch} from '../domain';

interface Props {
    state: INodeTreeState
    dispatch: NodeTreeDispatch
    node: INodePartialForTree
    selectedNode: null | INodePartialForTree
    level: number
    onToggle: (node: INodePartialForTree) => any
    onClick: (node: INodePartialForTree) => any
    allowedNodeTypes: NodeTypeName[]
}

export const NodeTreeNode: React.FC<Props> = props => {
    const nodeTypesRegistry = useNodeTypesRegistry();
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
        () => props.selectedNode && props.node.contextPath.equals(props.selectedNode.contextPath),
        [props.node, props.selectedNode]
    );

    const notSelectable = props.allowedNodeTypes && !props.allowedNodeTypes.reduce((acc, current) => acc || nodeTypesRegistry?.isOfType(props.node.nodeType, current), false);

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
                icon={notSelectable ? 'fas fa-unlink' : nodeType?.ui?.icon}
                iconLabel={nodeType?.label}
                level={props.level}
                onToggle={handleNodeToggle}
                onClick={notSelectable ? () => {} : handleNodeClick}
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
                        allowedNodeTypes={props.allowedNodeTypes}
                    />
                ))
            }
        </Tree.Node>
    );
};
