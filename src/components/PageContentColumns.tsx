import React, { ReactElement } from 'react';
import styles from 'src/styles/pageContent.module.scss'

interface Props {
    title: string
    content?: ReactElement
    render?: Function
    children: any
};

function PageContentColumns(props: Props) {
    const { title, 
            content: contentRaw, 
            render,
            children
    } = props;

    // const sanitizeRawContent = (content: ReactElement): ReactElement => content;

    // const content = sanitizeRawContent(contentRaw);
    return (
        <section className={styles.pageContentContainer}>
            <div className={styles.titleSection}><p>{title}</p></div>
            {/* <div className={styles.contentSection}>{content}</div> */}
            <div className={styles.contentSection}>{children}</div>
            {/* <div className={styles.contentSection}>{render()}</div> */}
        </section>
    );
};

export default PageContentColumns;
