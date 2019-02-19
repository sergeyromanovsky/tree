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
    initialContext,
    debounce
} from '../helpers';
import Spinner from '../components/Spinner';

// добавить Parent

const App = () => {
    const [inputVal, setValue] = useState('');
    const [data, setData] = useState({ init: [], filtered: [] });
    const [showLoader, setLoader] = useState(true);
    const [ctxMenuInfo, setCtxMenuInfo] = useState({});
    const [selectedPath, setSelectedPath] = useState([]);
    const ctxMenuRef = useRef(null);

    const { init, filtered } = data;
    const { show, x, y } = ctxMenuInfo;

    // TODO: add memoize

    function setParent(item, parent) {
        item.parent = parent;
        if (item.children) {
            item.children = item.children.map((i) => setParent(i, item));
        }

        return item;
    }
    console.log('rec test', init, setParent(init));

    const handleSearch = debounce((val) => {
        const trimValue = val.trim();
        if (!trimValue) {
            setData({ init, filtered: init });
            setValue('');
            return;
        }
        let updFiltered = filterTree(init, val);
        updFiltered = expandFilteredNodes(filtered, val);

        setData((prevState) => ({ ...prevState, filtered: updFiltered }));
    }, 100);

    const inputOnChange = (e) => {
        setValue(e.target.value);
        handleSearch(e.target.value);
    };

    const handleChangeName = (e, path) => {
        e.preventDefault();
        e.persist();

        const val = e.target[0].value;
        let ref = getElByPath(filtered, path);
        const parentRef = getElByPath(filtered, getParentObj(path));

        if (!val.trim()) {
            ref = parentRef;
            ref.children.pop();
        } else {
            const doesNameExist = parentRef.children.some((node) => node.name === val);
            if (doesNameExist) {
                // TODO: добавить рекурсию на имя
                ref.name = `${val}(1)`;
            } else {
                ref.name = val;
            }
            delete ref.type;
        }
        setData({ init, filtered });
    };

    const handleContextMenu = (e, path) => {
        e.persist();
        const { clientX, clientY } = e;
        setSelectedPath(path);
        setCtxMenuInfo({ x: clientX, y: clientY, show: true });
    };

    const handleClickOutsideCtxMenu = ({ target }) => {
        if (ctxMenuRef.current && !ctxMenuRef.current.contains(target)) {
            handleHideCtxMenu();
        }
    };

    const handleHideCtxMenu = () => setCtxMenuInfo({ x: 0, y: 0, show: false });

    const handleAddNode = (isDir) => {
        let ref = getElByPath(filtered, selectedPath);

        if (!ref.children) {
            // if no children, ref = clicked item parent
            ref = getElByPath(filtered, getParentObj(selectedPath));
        }
        ref.children.push({ name: '', type: 'rename', children: isDir ? [] : undefined });

        setData({ init, filtered });
        setCtxMenuInfo(initialContext);
    };

    const handleRemoveNode = () => {
        let ref = getElByPath(filtered, getParentObj(selectedPath));
        ref.children.splice(selectedPath[selectedPath.length - 1], 1);
        setData({ init, filtered });
        setCtxMenuInfo(initialContext);
    };

    const handleRename = () => {
        let ref = getElByPath(filtered, selectedPath);
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

    const updFiltered = Array.isArray(filtered) ? filtered : [filtered];

    return showLoader ? (
        <Spinner />
    ) : (
        <section className={style.wrapper} onClick={handleClickOutsideCtxMenu}>
            <Search inputVal={inputVal} change={inputOnChange} />
            <ul>
                {console.log(updFiltered)}
                {updFiltered.map((item) => (
                    <TreeNode
                        key={updFiltered}
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
