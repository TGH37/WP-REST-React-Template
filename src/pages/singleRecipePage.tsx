import React from 'react';
import PageContentColumns from '../components/PageContentColumns';

interface Props {};

function SingleRecipePage(props: Props) {
    const {} = props;

    const title = "Recipe"
    return (
        <PageContentColumns title={title}>
            <h2>Single Recipe</h2>
        </PageContentColumns>
    );
};

export default SingleRecipePage;
