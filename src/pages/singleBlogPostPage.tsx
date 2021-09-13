import React from 'react';
import PageContentColumns from '../components/PageContentColumns';

interface Props {
    data?: any
};

function SingleBlogPostPage(props: Props) {
    const { data } = props;
    const foo = data ? data : "no data"
    const title = "Blog"
    return (
        <PageContentColumns title={title}>
            {data ? <h2>{foo}</h2> :<h2>Single Blog Post</h2>}
        </PageContentColumns>
    );
};

export default SingleBlogPostPage;
