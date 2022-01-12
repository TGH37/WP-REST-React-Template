import React, { ReactElement, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import LinkModule from './LinkModule';
import HeroLHSImg500 from 'src/assets/imgs/heroLHS_500.png';

const data = [
    {title: "Get the balance right", 
    href: "/", 
    isExpandable: true, 
    exerpt: "Getting scientific about how you spend your time and what activities you do can be hugely beneficial to getting you working in a consistent manner that can increase both the quantity and quality of your output by orders of magnitude.", 
    content: 
    <>
        <p>We all have people that we look up to and think are worthy of imitation in some way. They seem to have things figured out in such a way that allows them to consistently put in the ridiculous effort that they go to, to achieve their goals. </p>

        <p>To me, this is a sign that they are getting some form of balance right in their lives. By living the way that they do, they are able to show up every day, stay focused and achieve results worthy of your attention.</p>

        <p>If we were to put it in programming terms, they have managed to set up their development environment in a way that allows them to be at their best when it comes to putting the actual work in. Just think back to a time when you have tried to use an unfamiliar IDE, or had to make do without intellisense or your favourite linting tool, did it slow you down?  </p>

        <p>Getting scientific about how you spend your time and what activities you do day-to-day can be hugely beneficial to getting you working in a consistent manner that can increase both the quantity and quality of your output by orders of magnitude.</p>
    </>},
    {title: "Do Your Chores",
    href:"/",
    isExpandable: false, 
    content: 
    <>
        <p>Be honest, did you do your chores when you were younger? Do you do them now? Elon Musk certainly thinks that you should, and that you should be regimented about it as well.</p>
        <button>Click Here to Read Article</button>
    </>},
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
            {data.map((dataObj, idx) => <LinkModule data={data[idx]}/>)}
        </ul>
    );
};



export default ModulatedContent;
