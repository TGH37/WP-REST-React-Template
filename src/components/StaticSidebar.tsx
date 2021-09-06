import React from 'react';
import styles from 'src/styles/layout.module.scss';

interface Props {};

function StaticSidebar(props: Props) {
    const {} = props;
    
    return (
        <aside className={styles.staticSidebar}>
            <p>Foo Content</p>
        </aside>
    );
};

export default StaticSidebar;
