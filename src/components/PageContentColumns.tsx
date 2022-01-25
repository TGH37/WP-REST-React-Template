import React, { ReactElement } from 'react';
import styles from 'src/styles/pageContent.module.scss'

interface Props {
    title: string
    content?: ReactElement
    children: any
};

function PageContentColumns(props: Props) {
    const { title, 
            content: contentRaw, 
            children
    } = props;

    return (
        <section className={styles.pageContentContainer}>
            <div className={styles.titleSection}><p dangerouslySetInnerHTML={{__html: title}}/></div>
            <div className={styles.contentSection}>{children}</div>
        </section>
    );
};

export default PageContentColumns;
