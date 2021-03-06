import React, { useState, useEffect, useMemo } from 'react';
import style from './style.module.scss';
import NodeHeader from './NodeHeader';

const TreeNode = ({ node, isDir, path, onRightClick, changeName }) => {
    const [collapsed, setCollapsed] = useState(
        node && (node.collapsed || node.defaultCollapsed) ? true : false
    );

    useEffect(() => {
        setCollapsed(collapsed);
    }, [collapsed]);
    const toggleCollapse = () => setCollapsed((prevCollapsed) => !prevCollapsed);

    const renderChildren = useMemo(() => {
        let { children } = node;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }
        return (
            <ul className={style.list}>
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
    }, [node]);
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
            {collapsed && renderChildren}
        </li>
    );
};

export default TreeNode;
