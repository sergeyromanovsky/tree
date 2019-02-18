import React, { Component } from 'react';
import style from './index.module.scss';

import TreeNode from '../components/TreeNode';
import ContextMenu from '../components/ContextMenu';
import Search from '../components/Search';

import { filterTree, expandFilteredNodes, getElByPath, getParentObj } from '../helpers';
import Spinner from '../components/Spinner';

const initialContext = {
    x: null,
    y: null,
    show: false
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialData: null,
            data: null,
            inputVal: '',
            selectedPath: [],
            ctxMenu: initialContext,
            isFetching: true
        };
        this.ctxMenuRef = React.createRef();
    }
    onChangeSearch = (e) => {
        const { initialData } = this.state;
        const value = e.target.value.trim();

        if (!value) {
            return this.setState({ data: { ...initialData }, inputVal: '' });
        }
        let filtered = filterTree(initialData, value);
        filtered = expandFilteredNodes(filtered, value);

        this.setState({ data: filtered, inputVal: e.target.value });
    };

    handleChangeName = (e, path) => {
        e.preventDefault();
        e.persist();
        const val = e.target[0].value;
        const updData = { ...this.state.data };
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
        this.setState({ data: updData });
    };

    handleContextMenu = (e, path) => {
        e.persist();
        const { clientX, clientY } = e;
        this.setState({ selectedPath: path, ctxMenu: { x: clientX, y: clientY, show: true } });
    };

    handleClickOutsideCtxMenu = ({ target }) => {
        if (this.ctxMenuRef.current && !this.ctxMenuRef.current.contains(target)) {
            this.handleHideCtxMenu();
        }
    };

    handleHideCtxMenu = () => this.setState({ ctxMenu: { x: 0, y: 0, show: false } });

    handleAddNode = (isDir) => {
        const { selectedPath } = this.state;
        const updData = { ...this.state.data };
        // TODO: почему добавляет в массив даже без SetState ?
        let ref = getElByPath(updData, selectedPath);

        if (!ref.children) {
            // if no children, ref = clicked item parent
            ref = getElByPath(updData, getParentObj(selectedPath));
        }
        ref.children.push({ name: '', type: 'rename', children: isDir ? [] : undefined });

        this.setState({ ctxMenu: initialContext, data: updData });
    };

    handleRemoveNode = () => {
        const { selectedPath } = this.state;
        const updData = { ...this.state.data };
        let ref = getElByPath(updData, getParentObj(selectedPath));

        ref.children.splice(selectedPath[selectedPath.length - 1], 1);
        this.setState({ data: updData, ctxMenu: initialContext });
    };

    handleRename = () => {
        const { selectedPath } = this.state;
        const updData = { ...this.state.data };

        let ref = getElByPath(updData, selectedPath);
        ref.type = 'rename';
        this.handleHideCtxMenu();
    };

    componentDidMount = () => {
        fetch('/api/data', { method: 'GET' })
            .then((res) => res.json())
            .then((res) => this.setState({ data: res, isFetching: false, initialData: res }))
            .catch((e) => console.error(e));
    };

    render() {
        const {
            data,
            inputVal,
            ctxMenu: { show, x, y },
            isFetching
        } = this.state;

        let updData = !Array.isArray(data) ? [data] : data;

        return isFetching ? (
            <Spinner />
        ) : (
            <section className={style.wrapper} onClick={this.handleClickOutsideCtxMenu}>
                <Search inputVal={inputVal} change={this.onChangeSearch} />
                <ul>
                    {updData.map((item) => (
                        <TreeNode
                            key={JSON.stringify(updData)}
                            node={item}
                            path={[]}
                            onRightClick={this.handleContextMenu}
                            changeName={this.handleChangeName}
                        />
                    ))}
                </ul>
                {show && (
                    <ContextMenu
                        ref={this.ctxMenuRef}
                        x={x}
                        y={y}
                        addNode={this.handleAddNode}
                        rename={this.handleRename}
                        removeNode={this.handleRemoveNode}
                    />
                )}
            </section>
        );
    }
}

export default App;
