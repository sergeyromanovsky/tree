import React from 'react';
import style from './style.module.scss';
import DirIcon from '../../../assets/folder.svg';
import FileIcon from '../../../assets/file.svg';

const NodeHeader = ({ node: { name, type }, isDir, click, path, onRightClick, changeName }) => {
    return type === 'rename' ? (
        <form className={style.form} onSubmit={(e) => changeName(e, path)}>
            <input autoFocus name="fileName" type="text" />
        </form>
    ) : (
        <div className={style.wrapper}>
            {isDir ? (
                <DirIcon width="2.5vh" height="2.5vh" viewBox="0 0 10 10" />
            ) : (
                <FileIcon width="2.5vh" height="2.5vh" viewBox="0 0 15 15" />
            )}
            <span
                className={isDir ? 'dir' : 'file'}
                onClick={click}
                onContextMenu={(e) => onRightClick(e, path)}
            >
                {name}
            </span>
        </div>
    );
};

export default NodeHeader;
