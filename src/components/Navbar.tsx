import React, { useContext, useState } from 'react';
import styles from 'src/styles/layout.module.scss';
import { ReactComponent as Bars } from 'src/assets/svgs/bars.svg';
import { ReactComponent as Logo } from 'src/assets/svgs/react.svg';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { GlobalCtx } from '../contexts/GlobalCtx';

interface Props {};

function Navbar(props: Props) {
    const {} = props;
    const { isNavExpanded, toggleIsNavExpanded } = useContext(GlobalCtx);

    const menuIconClickHandler = (): void => toggleIsNavExpanded(!isNavExpanded);

    const getNavDynAttrs = () => {
        const dynamicAttrs =  isNavExpanded ? 
        {
          'aria-expanded': true,
        } :
        {
          'aria-expanded': false,
        }
        const staticAttrs = {className: `${styles.navContainer} ${isNavExpanded ? styles.navExpanded : ""}`}
        return {...staticAttrs, ...dynamicAttrs}
      };


    return (
        <nav {...getNavDynAttrs()}>
            <div className={`${styles.staticItemsContainer}`} >
                <div 
                    className={`${styles.staticItem} ${styles.bars}`}
                    onClick={menuIconClickHandler}
                    >
                    <Bars x={0} y={0} viewBox="0 0 125 55"/>
                </div>
                <div 
                    className={`${styles.staticItem} ${""}`}
                    >
                    <Logo x={0} y={0} viewBox="0 0 220 190"/>
                </div>
            </div>
            <div className={`${styles.navLinksContainer} ${isNavExpanded ? styles.showWhenExpanded : styles.hiddenWhenCollapsed}`}>
                <ul>
                    <li className={styles.listTitle} >RECIPES</li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/recipes">Beginner Phase (0 - 4 weeks)</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/">Intermediate Phase (4 - 8 weeks)</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/">Fat Blaster (8 - 10 weeks)</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/">Expert (12+ weeks)</NavLink></li>
                </ul>

                <ul>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/">Home</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/about">About Me</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/resources">Resources</NavLink></li>
                </ul>
                <ul>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/blog">Blog</NavLink></li>
                    <li><NavLink onClick={menuIconClickHandler} activeClassName={styles.activeLink} exact={true} to="/contact">Get in Touch</NavLink></li>

                </ul>
                <SearchBar />
            </div>
        </nav>
    );
};

export default Navbar;

