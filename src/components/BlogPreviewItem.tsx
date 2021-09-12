import React, { useEffect, useState } from 'react';
import styles from 'src/styles/blog.module.scss'

interface Props {
    title: string,
    excerpt: string
    meta: string[]
    feautredMediaId: number
};

function BlogPreviewItem(props: Props) {
    const {title, excerpt, meta, feautredMediaId} = props;
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`http://www.react-test.dev.cc/wp-json/wp/v2/media/${feautredMediaId}`)
        .then(res => res.json())
        .then(res => {
            setMediaUrl(res.media_details.sizes.full.source_url);
            // if(!window.sessionStorage.getItem("keto-bps")) window.sessionStorage.setItem("keto-bps", "");
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    }, []);

    // const populateSessionStorage = (root: string, res: ) => {
    //     if(typeof window === "undefined") return
    //     const fromStorage = window.sessionStorage.getItem("keto-bps")?.split(",") || [];
    //   }

    return (
        <div className={styles.previewCard} onClick={() => {}}>
            <div className={`${styles.cardImgContainer} ${mediaUrl ? "" : styles.emptyImgContainer}`}>
               { mediaUrl ? <img src={mediaUrl} alt="" /> : <p>{isLoading ? "Loading Image..." : "No Image Found..."}</p>}
            </div>
            <h3>{title}</h3>
            <p dangerouslySetInnerHTML={{__html: excerpt}}></p>
            <div>{meta.map((data) => <span>{data}</span>)}</div>
        </div>
    );
};

export default BlogPreviewItem;
