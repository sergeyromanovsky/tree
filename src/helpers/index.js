// Helper functions for filtering
export const defaultMatcher = (filterText, name) => name.toLowerCase().includes(filterText);

export const findNode = ({ name, children }, inputValue, matcher = defaultMatcher) => {
    // i match or i have children and one of them match
    return (
        matcher(inputValue, name) ||
        (children && children.length && !!children.find((child) => findNode(child, inputValue)))
    );
};

export const filterTree = (node, inpValue) => {
    // If im an exact match, then all my children get to stay
    // or stop filtering if i have no child
    if (defaultMatcher(inpValue, node.name) || !node.children) {
        return node;
    }
    const result = node.children
        .filter((c) => findNode(c, inpValue))
        .map((c) => filterTree(c, inpValue));

    return { ...node, children: result, isDir: !result.child };
};

export const expandFilteredNodes = (node, inpValue, matcher = defaultMatcher) => {
    let { children } = node;

    if (!children || children.length === 0) {
        return { ...node, toggled: false };
    }
    const childrenWithMatches = children.filter((child) => findNode(child, inpValue, matcher));
    const shouldCollapse = childrenWithMatches.length > 0;

    // If im going to expand, go through all the matches and see if thier children need to expand
    if (shouldCollapse) {
        children = childrenWithMatches.map((child) =>
            expandFilteredNodes(child, inpValue, matcher)
        );
    }

    return {
        ...node,
        children,
        collapsed: shouldCollapse
    };
};

export const getElByPath = (data, path) => {
    let ref = data;
    let i = 0;
    while (i < path.length) {
        ref = ref.children[path[i]];
        ref.collapsed = true;
        i++;
    }
    return ref;
};

export const getParentObj = (path) => path.slice(0, path.length - 1);

export const initialContext = {
    x: null,
    y: null,
    show: false
};

export const initialState = {
    initialData: null,
    data: null,
    inputVal: '',
    selectedPath: [],
    ctxMenu: initialContext,
    isFetching: true
};

export const debounce = (f, ms) => {
    let timer = null;
    return function(...args) {
        const onComplete = () => {
            f.apply(this, args);
            timer = null;
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
};
