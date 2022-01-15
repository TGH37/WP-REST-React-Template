import React, { useEffect, useState } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import { Outlet, useLocation, useMatch, useParams } from 'react-router'; 
import { WP_REST_API_Post } from 'wp-types';

interface Props {
};

function SingleBlogPostPage(props: Props) {
    const {  } = props;
    const url = "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/posts";

    const params = useParams();

    const [title, setTitle] = useState<string>("title")
    const [pageContent, setPageContent] = useState<any>(null)

    const fetchData = async (): Promise<void> => {
        try {
            const res = await fetch(`${url}?slug=${params.slug}&_fields=title,content`);
            const resJson: Partial<WP_REST_API_Post[]> = await res.json();
            if(!resJson.length || resJson[0] === undefined) {
                setPageContent('<h1>Page content not found</h1>');
                return;
            };
            console.log(resJson[0].content);
            setTitle(resJson[0].title.rendered );
            setPageContent(resJson[0].content.rendered );
            return;
            
        } catch (err) {
            console.log(err)
        }
    };

    const renderedPageContent = pageContent ? <div dangerouslySetInnerHTML={{__html: pageContent}}/> : <p>Loading...</p>

    useEffect(() => {
        fetchData();
    },[])
    
    return (
        <PageContentColumns title={title}>
                {renderedPageContent}
        </PageContentColumns>
    );
};

export default SingleBlogPostPage;
