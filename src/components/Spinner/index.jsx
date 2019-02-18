import React from 'react';
import style from './style.module.scss';

const Spinner = () => {
    return (
        <div className={style.spinner}>
            <div className={style.bounce1} />
            <div className={style.bounce2} />
            <div className={style.bounce3} />
        </div>
    );
};

export default Spinner;
