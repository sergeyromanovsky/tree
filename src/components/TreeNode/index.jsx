import React, { Component, useState } from 'react';
import './style.scss';
import NodeHeader from './NodeHeader';

class TreeNode extends Component {
    constructor(props) {
        super(props);

        const { node } = this.props;
        this.state = {
            collapsed: node && (node.collapsed || node.defaultCollapsed) ? true : false
        };
    }

    toggleCollapse = (path) => {
        this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    };

    renderChildren = ({ children }) => {
        const { path, onRightClick, changeName } = this.props;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }
        return (
            <ul>
                {children.map((child, index) => (
                    <TreeNode
                        key={child.name}
                        node={child}
                        isDir={!!child.children}
                        path={path.concat(index)}
                        onRightClick={onRightClick}
                        changeName={changeName}
                    />
                ))}
            </ul>
        );
    };
    render() {
        const { node, isDir, path, onRightClick, changeName } = this.props;
        const { collapsed } = this.state;
        return (
            <li>
                <NodeHeader
                    click={this.toggleCollapse}
                    node={node}
                    isDir={isDir}
                    path={path}
                    onRightClick={onRightClick}
                    changeName={changeName}
                />
                {collapsed && this.renderChildren(node)}
            </li>
        );
    }
}

export default TreeNode;
