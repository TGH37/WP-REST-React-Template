import React, { useEffect, useState } from 'react';
import styles from 'src/styles/blog.module.scss'

interface Props {
    title: string,
    excerpt: string
    meta: string[]
    postUrl: string
};

function BlogPreviewItem(props: Props) {
    const {title, excerpt, meta, postUrl} = props;
    return (
        <div className={styles.previewCard} onClick={() => {}}>
            <div className={`${styles.cardImgContainer} ${postUrl ? "" : styles.emptyImgContainer}`}>
               { postUrl ? <img src={postUrl} alt="" /> : <p>No Image Found...</p>}
            </div>
            <h3>{title}</h3>
            <p dangerouslySetInnerHTML={{__html: excerpt}}></p>
            <div>{meta.map((data) => <span key={`${title}_${data}`}>{data}</span>)}</div>
        </div>
    );
};

export default BlogPreviewItem;
