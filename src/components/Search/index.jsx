import React from 'react';
import style from './style.module.scss';

import Icon from '../../assets/search.svg';

const Search = ({ inputVal, change }) => {
    return (
        <div className={style.wrapper}>
            <Icon width="2vh" height="2vh" viewBox="0 0 20 20" />
            <input
                onChange={change}
                placeholder="Search the tree..."
                type="text"
                value={inputVal}
            />
        </div>
    );
};

export default Search;
