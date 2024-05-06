/*
 * This script belongs to the package "Sitegeist.Archaeopteryx".
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from "react";

import { Tree as NeosTree } from "@neos-project/react-ui-components";

import { TreeNodeDTO } from "../domain/TreeNodeDTO";
import { getChildrenForTreeNode } from "../infrastructure/http";

interface Props {
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    baseNodeTypeFilter: string;
    treeNode: TreeNodeDTO;
    selectedTreeNodeId?: string;
    level: number;
    onClick: (treeNodeId: string) => void;
}

export const TreeNode: React.FC<Props> = (props) => {
    const isSelected =
        props.selectedTreeNodeId === props.treeNode.nodeAggregateIdentifier;
    const hasChildren =
        props.treeNode.children.length > 0 ||
        props.treeNode.hasUnloadedChildren;
    const [isCollapsed, setIsCollapsed] = React.useState(
        props.treeNode.hasUnloadedChildren
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [children, setChildren] = React.useState(props.treeNode.children);
    const handleNodeToggle = React.useCallback(async () => {
        if (
            isCollapsed &&
            props.treeNode.hasUnloadedChildren &&
            children.length === 0
        ) {
            setIsLoading(true);
            const result = await getChildrenForTreeNode({
                workspaceName: props.workspaceName,
                dimensionValues: props.dimensionValues,
                treeNodeId: props.treeNode.nodeAggregateIdentifier,
                nodeTypeFilter: props.baseNodeTypeFilter,
            });

            if ("success" in result) {
                setChildren(result.success.children);
            }

            setIsLoading(false);
            setIsCollapsed(false);
        } else {
            setIsCollapsed((isCollapsed) => !isCollapsed);
        }
    }, [
        props.workspaceName,
        props.dimensionValues,
        props.treeNode.nodeAggregateIdentifier,
        props.baseNodeTypeFilter,
        children.length,
    ]);
    const handleNodeClick = React.useCallback(() => {
        if (props.treeNode.isMatchedByFilter) {
            props.onClick(props.treeNode.nodeAggregateIdentifier);
        }
    }, [
        props.treeNode.isMatchedByFilter,
        props.treeNode.nodeAggregateIdentifier,
    ]);

    return (
        <NeosTree.Node>
            <NeosTree.Node.Header
                labelIdentifier={"labelIdentifier"}
                id={props.treeNode.nodeAggregateIdentifier}
                hasChildren={hasChildren}
                isLastChild={true}
                isCollapsed={isCollapsed}
                isActive={isSelected}
                isFocused={isSelected}
                isLoading={isLoading}
                isDirty={false}
                isHidden={props.treeNode.isDisabled}
                isHiddenInIndex={
                    props.treeNode.isHiddenInMenu ||
                    !props.treeNode.isMatchedByFilter
                }
                isDragging={false}
                hasError={false}
                label={props.treeNode.label}
                icon={
                    props.treeNode.isMatchedByFilter
                        ? props.treeNode.icon
                        : "fas fa-unlink"
                }
                iconLabel={props.treeNode.nodeTypeLabel}
                level={props.level}
                onToggle={handleNodeToggle}
                onClick={handleNodeClick}
                dragForbidden={true}
                title={props.treeNode.label}
            />
            {isCollapsed
                ? null
                : children.map((childTreeNode) => (
                      <TreeNode
                          {...props}
                          treeNode={childTreeNode}
                          level={props.level + 1}
                      />
                  ))}
        </NeosTree.Node>
    );
};
