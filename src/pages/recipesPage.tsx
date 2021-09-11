import React, { useEffect, useMemo, useState } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { Link, useRouteMatch } from 'react-router-dom';

interface Props {};

function RecipesPage(props: Props) {
    const {} = props;
    const [wpData, setWpData] = useState<any>(null);

    const { url } = useRouteMatch();

    useEffect(() => {
        fetch("http://www.react-test.dev.cc/wp-json/wp/v2/recipes")
            .then( res => res.json())
            .then(formattedRes => {setWpData(formattedRes);})
            .catch(err => console.log(err));
    }, [])

    const blogPosts = useMemo(() => {
        if(!wpData) return;
        const postArry = Array.from(wpData);
        return postArry.map((post: any) => {
            const { title, excerpt, modified, id, featured_media, slug}: {title: {rendered: string}, excerpt: {rendered: string, protected: boolean,}, modified: string, id: number, featured_media: number, slug: string} = post;

            return <Link to={`${url}/${slug}`}><BlogPreviewItem title={title.rendered} excerpt={excerpt.rendered} meta={[modified]} feautredMediaId={featured_media} key={`recipe_prev_id:${id}`}/></Link>
        });

    }, [wpData])
    return (
        <>
            <PageContentColumns title={"recipes"}>
                <>
                    {blogPosts}
                    {/* <BlogPreviewItem /> */}
                    {/* <p>{wpData}</p> */}
                </>
            </PageContentColumns>
        </>
    );
};

export default RecipesPage;
