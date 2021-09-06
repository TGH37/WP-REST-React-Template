import React from 'react';
import styles from 'src/styles/layout.module.scss'
import { ReactComponent as Bars } from 'src/assets/svgs/bars.svg'
import { ReactComponent as LogoSVG } from 'src/assets/svgs/react.svg'
import Logo from 'src/assets/imgs/Logo.png'

interface Props {};

function Navbar(props: Props) {
    const {} = props;

    return (
        <nav className={styles.navContainer}>
            <div className={styles.itemVisibleWhenCollapsed}><Bars /></div>
            <div className={styles.itemVisibleWhenCollapsed}><LogoSVG /></div>
            {/* <div className={styles.itemVisibleWhenCollapsed}><img src={Logo} alt="" /></div> */}
        </nav>
    );
};

export default Navbar;
