import React, { forwardRef } from 'react';
import style from './style.module.scss';

const ContextMenu = forwardRef(({ x, y, addNode, removeNode, rename }, ref) => {
    return (
        <div className={style.wrapper} ref={ref} style={{ top: y, left: x }}>
            <ul>
                <li onClick={() => addNode(false)}>Add File</li>
                <li onClick={() => addNode(true)}>Add Folder</li>
                <li onClick={rename}>Rename</li>
                <li onClick={removeNode}>Delete</li>
            </ul>
        </div>
    );
});

export default ContextMenu;
