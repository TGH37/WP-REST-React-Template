import React from 'react';
import styles from 'src/styles/layout.module.scss';
import { ReactComponent as Logo } from 'src/assets/svgs/logo.svg';
import SocialMedia from './SocialMedia';

interface Props {};

function MobileHeader(props: Props) {
    const {} = props;

    return (
        <header className={styles.mobileHeader}>
            <p>Live Healthy <br />Live Smart <br />Live Well</p>
            <div className={`${styles.mobileHeaderLogoContainer} ${""}`}>
                    <Logo x={0} y={0} viewBox="0 0 114.471 110.804"/>
                </div>
            <SocialMedia />
        </header>
    );
};

export default MobileHeader;
