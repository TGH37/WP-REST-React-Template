import React from 'react';
import PageContentColumns from '../components/PageContentColumns';

interface Props {};

function SingleBlogPostPage(props: Props) {
    const {} = props;

    const title = "Blog"
    return (
        <PageContentColumns title={title}>
            <h2>Single Blog Post</h2>
        </PageContentColumns>
    );
};

export default SingleBlogPostPage;
