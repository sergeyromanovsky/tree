import React from 'react';

const Search = ({ inputVal, change }) => {
    return (
        <div>
            {/* <span className="input-group-addon">
                        <i className="fa fa-search" />
                    </span> */}
            <input
                // className="form-control"
                onChange={change}
                placeholder="Search the tree..."
                type="text"
                value={inputVal}
            />
        </div>
    );
};

export default Search;
