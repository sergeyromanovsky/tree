import React, { useState, useRef, useEffect } from 'react';
import style from './index.module.scss';

import TreeNode from '../components/TreeNode';
import ContextMenu from '../components/ContextMenu';
import Search from '../components/Search';

import {
    filterTree,
    expandFilteredNodes,
    getElByPath,
    getParentObj,
    initialState,
    initialContext,
    debounce
} from '../helpers';
import Spinner from '../components/Spinner';

const App = () => {
    const [state, setState] = useState(initialState);
    const [inputVal, setValue] = useState('');
    const [data, setData] = useState(null);
    const [showLoader, setLoader] = useState(true);
    const ctxMenuRef = useRef(null);

    const { init, filtered } = data;

    const handleSearch = debounce(() => {
        // e.persist();
        const trimValue = inputVal.trim();
        if (!trimValue) {
            setData(({ filtered }) => ({ init: { ...initialData }, filtered }));
        }
        let filtered = filterTree(initialData, inputVal);
        filtered = expandFilteredNodes(filtered, inputVal);
        setData((prevState) => ({ ...prevState, filtered }));
    }, 500);

    const inputOnChange = (e) => {
        setValue(e.target.value);
        handleSearch();
    };

    const handleChangeName = (e, path) => {
        e.preventDefault();
        e.persist();

        const val = e.target[0].value;
        let ref = getElByPath(updData, path);
        const parentRef = getElByPath(updData, getParentObj(path));

        if (!val.trim()) {
            ref = parentRef;
            ref.children.pop();
        } else {
            const doesNameExist = parentRef.children.some((node) => node.name === val);
            if (doesNameExist) {
                // TODO: remove hardcode
                ref.name = `${val}(1)`;
            } else {
                ref.name = val;
            }
            delete ref.type;
        }
        setState((prevState) => ({ ...prevState, data: updData }));
    };

    const handleContextMenu = (e, path) => {
        e.persist();
        const { clientX, clientY } = e;
        setState((prevState) => ({
            ...prevState,
            selectedPath: path,
            ctxMenu: { x: clientX, y: clientY, show: true }
        }));
    };

    const handleClickOutsideCtxMenu = ({ target }) => {
        if (ctxMenuRef.current && !ctxMenuRef.current.contains(target)) {
            handleHideCtxMenu();
        }
    };

    const handleHideCtxMenu = () =>
        setState((prevState) => ({ ...prevState, ctxMenu: { x: 0, y: 0, show: false } }));

    const handleAddNode = (isDir) => {
        // TODO: почему добавляет в массив даже без SetState ?
        let ref = getElByPath(updData, selectedPath);

        if (!ref.children) {
            // if no children, ref = clicked item parent
            ref = getElByPath(updData, getParentObj(selectedPath));
        }
        ref.children.push({ name: '', type: 'rename', children: isDir ? [] : undefined });

        setState((prevState) => ({ ...prevState, ctxMenu: initialContext, data: updData }));
    };

    const handleRemoveNode = () => {
        let ref = getElByPath(updData, getParentObj(selectedPath));
        ref.children.splice(selectedPath[selectedPath.length - 1], 1);
        setState((prevState) => ({ ...prevState, data: updData, ctxMenu: initialContext }));
    };

    const handleRename = () => {
        let ref = getElByPath(updData, selectedPath);
        ref.type = 'rename';
        handleHideCtxMenu();
    };

    useEffect(() => {
        fetch('/api/data', { method: 'GET' })
            .then((res) => res.json())
            .then((res) => {
                setLoader(false);
                setData({ init: res, filtered: res });
            })
            .catch((e) => console.error(e));
    }, []);

    const {
        ctxMenu: { show, x, y }
    } = state;

    return showLoader ? (
        <Spinner />
    ) : (
        <section className={style.wrapper} onClick={handleClickOutsideCtxMenu}>
            {/* <Search inputVal={inputVal} change={(e) => onChangeSearch(e.target.value)} /> */}
            <Search inputVal={inputVal} change={inputOnChange} />
            <ul>
                {dataArr.map((item) => (
                    <TreeNode
                        key={JSON.stringify(dataArr)}
                        node={item}
                        path={[]}
                        onRightClick={handleContextMenu}
                        changeName={handleChangeName}
                    />
                ))}
            </ul>
            {show && (
                <ContextMenu
                    ref={ctxMenuRef}
                    x={x}
                    y={y}
                    addNode={handleAddNode}
                    rename={handleRename}
                    removeNode={handleRemoveNode}
                />
            )}
        </section>
    );
};

export default App;
