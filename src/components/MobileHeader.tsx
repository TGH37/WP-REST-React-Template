import React from 'react';
import styles from 'src/styles/layout.module.scss';

interface Props {};

function MobileHeader(props: Props) {
    const {} = props;

    return (
        <header className={styles.mobileHeader}>
            <div>Mobile Header</div>
        </header>
    );
};

export default MobileHeader;
