import React, { useState } from 'react';
import './style.scss';
import NodeHeader from './NodeHeader';

const TreeNode = ({ node, isDir, path, onRightClick, changeName }) => {
    const [collapsed, setCollapsed] = useState(
        node && (node.collapsed || node.defaultCollapsed) ? true : false
    );
    const toggleCollapse = () => setCollapsed((prevCollapsed) => !prevCollapsed);

    const renderChildren = ({ children }) => {
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
    return (
        <li>
            <NodeHeader
                click={toggleCollapse}
                node={node}
                isDir={isDir}
                path={path}
                onRightClick={onRightClick}
                changeName={changeName}
            />
            {collapsed && renderChildren(node)}
        </li>
    );
};

export default TreeNode;
