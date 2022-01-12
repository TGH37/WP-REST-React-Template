import React from 'react';
import styles from 'src/styles/layout.module.scss';
import SocialMedia from './SocialMedia';
import { ReactComponent as Logo } from 'src/assets/svgs/logo.svg';

interface Props {};

function StaticSidebar(props: Props) {
    const {} = props;
    
    return (
        <aside className={styles.staticSidebar}>
            <p>Live Healthy <br />Live Smart <br />Live Well</p>
                <div className={`${styles.staticItem} ${""}`}>
                    <Logo x={0} y={0} viewBox="0 0 114.471 110.804"/>
                </div>
            <SocialMedia />
        </aside>
    );
};

export default StaticSidebar;
