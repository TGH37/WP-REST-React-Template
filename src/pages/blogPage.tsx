import React, { useEffect, useMemo, useState } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [wpData, setWpData] = useState<any>(null);
    const { url } = useRouteMatch();

    useEffect(() => {
        fetch("http://www.react-test.dev.cc/wp-json/wp/v2/posts")
            .then( res => res.json())
            .then(formattedRes => {setWpData(formattedRes); console.log(formattedRes)})
            .catch(err => console.log(err));
    }, []);

    const blogPosts = useMemo(() => {
        if(!wpData) return;
        const postArry = Array.from(wpData);
        return postArry.map((post: any) => {
            const { title, excerpt, modified, id, featured_media, slug}: {title: {rendered: string}, excerpt: {rendered: string, protected: boolean,}, modified: string, id: number, featured_media: number, slug: string} = post;
            return <Link to={`${url}/${slug}`}><BlogPreviewItem title={title.rendered} excerpt={excerpt.rendered} meta={[modified]} key={`blog_post_prev_id:${id}`} feautredMediaId={featured_media}/></Link>;
        });

    }, [wpData]);

    return (
        <>
            <PageContentColumns title={"Blog"}>
                <>
                    {blogPosts}
                </>
               
            </PageContentColumns>
        </>
    );
};

export default BlogPage;
