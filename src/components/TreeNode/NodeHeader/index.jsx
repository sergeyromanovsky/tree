import React from 'react';
import './style.scss';

const NodeHeader = ({ node: { name, type }, isDir, click, path, onRightClick, changeName }) => {
    return type === 'rename' ? (
        <form onSubmit={(e) => changeName(e, path)}>
            <input autoFocus name="fileName" type="text" />
        </form>
    ) : (
        <span
            className={isDir ? 'dir' : 'file'}
            onClick={click}
            onContextMenu={(e) => onRightClick(e, path)}
        >
            {name}
        </span>
    );
};

export default NodeHeader;
