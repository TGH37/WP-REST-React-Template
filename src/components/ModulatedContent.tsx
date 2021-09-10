import React, { ReactElement, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import LinkModule from './LinkModule';
import HeroLHSImg500 from 'src/assets/imgs/heroLHS_500.png';

const data = [
    {title: "module title", href: "/", isExpandable: true, exerpt: "blarg", content: <><p>Lorem ipsum <strong>dolor</strong> sit amet consectetur adipisicing elit. Commodi, quas? Hic odit, debitis suscipit accusantium explicabo unde nam earum neque.</p><p>Lorem ipsum <strong>dolor</strong> sit amet consectetur adipisicing elit. Commodi, quas? Hic odit, debitis suscipit accusantium explicabo unde nam earum neque.</p><p>Lorem ipsum <strong>dolor</strong> sit amet consectetur adipisicing elit. Commodi, quas? Hic odit, debitis suscipit accusantium explicabo unde nam earum neque.</p><img src={HeroLHSImg500}/></>},
    {title: "module title", href:"/", isExpandable: false, content: <><p>foobar</p></>},
]

interface Props {
    hasExpandableSections?: boolean
};

const defaultProps: Props = {
};

function ModulatedContent(propsIn: Props) {
    const {} = propsIn;
    const props = {...defaultProps, ...propsIn};

    return (
        <ul>
            {data.map((dataObj, idx) => <LinkModule data={data[idx]} />)}
        </ul>
    );
};



export default ModulatedContent;
