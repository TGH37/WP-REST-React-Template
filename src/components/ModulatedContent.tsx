import React from 'react';
import LinkModule from './LinkModule';
import { WP_REST_API_Post } from 'wp-types';

interface Props {
    data: Partial<WP_REST_API_Post>[]
};

function ModulatedContent(props: Props) {
    const {data} = props;

    return (
        <ul>
            {data.map((dataObj, idx) => <LinkModule data={dataObj} key={dataObj.id} />)}
        </ul>
    );
};



export default ModulatedContent;
