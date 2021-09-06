import React from 'react';
import styles from 'src/styles/layout.module.scss'
import { ReactComponent as Bars } from 'src/assets/svgs/bars.svg'
import { ReactComponent as Logo } from 'src/assets/svgs/react.svg'

interface Props {};

function Navbar(props: Props) {
    const {} = props;

    return (
        <nav className={styles.navContainer}>
            <div className={`${styles.itemVisibleWhenCollapsed} ${styles.bars}`}><Bars x={0} y={0} viewBox="0 0 125 55"/></div>
            <div className={`${styles.itemVisibleWhenCollapsed} ${""}`}><Logo x={0} y={0} viewBox="0 0 220 190"/></div>
        </nav>
    );
};

export default Navbar;
