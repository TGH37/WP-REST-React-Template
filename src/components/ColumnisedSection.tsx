import React from 'react'
import styles from 'src/styles/mainContent.module.scss';

interface Props {
    title: string
    render: Function
};

function ColumnisedSection(props: Props) {
    const { title, render } = props;

    return (
        <section className={styles.columnisedSectionContainer}>
            <div className={styles.moduleTitleContainer}>
                <p>{title}</p>
            </div>
            <div className={styles.moduleContent}>
                {render()}
            </div>
        </section>
    );
};

export default ColumnisedSection;
