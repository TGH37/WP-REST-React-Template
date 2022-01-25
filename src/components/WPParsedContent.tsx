// WPParsedContent
import React, { useEffect, useState } from 'react'
import ColumnisedSection from './ColumnisedSection';
import parse from 'html-react-parser';
import { WalkNode } from 'walkjs/lib/node';
import { Break, WalkBuilder } from 'walkjs';

interface Props {
    data: string
}

function WPParsedContent(props: Props) {
    const {
        data,
    } = props;

    const [parsedContent, setParsedContent] = useState<JSX.Element | JSX.Element[] | string>(parse(data));
    const [restSections, setRestSections] = useState<JSX.Element[]>([]);
    const [composedContents, setComposedContents] = useState<ComposedRestSectionObject[]>([]);
    const [restSectionTitles, setRestSectionTitles] = useState<RestSectionTitleMatch[]>([]);

    const castParsedContentToArry = () => {
        if(typeof parsedContent === 'string') return[];
        return (parsedContent instanceof Array) ? parsedContent : [parsedContent];
    };

        
    // NOTE: Divide parsed content into an array of sections, requires each desired section to be wrapped in a <div> tag with className='rest-section' in WordPress
    useEffect(() => {
        const workingParsedContent = castParsedContentToArry();
        if(workingParsedContent === []) return;
        workingParsedContent.map((node) => {
            if(typeof node === 'string') return;
            try {
                if(node.props.className.search('rest-section')) {
                    setRestSections(prev => {
                        const returnArry = Array.from(prev);
                        returnArry.push(node as JSX.Element);
                        return returnArry;
                    });
                };
            } catch (err) {
                console.log(err);
            };
        });
    }, [parsedContent]);

    // NOTE: Walks through each rest-section, looking for a tag with a 'data-title' attribute (added in WordPress), to extract the title for that section
    useEffect(() => {

        if(!restSections.length) return;
        let numTitlesExtracted = 0;

        const getNodeRootIdx = (path: string) => {
            // NOTE: from WalkNode.getPath() => format similar to - [1]["props"]["children"]["props"]["children"][1]["props"]
            const splitPath = path.split("]")
            return parseInt(splitPath[0].replace("[", ""));
        };
        
        const checkHasTitle = (node: WalkNode) => {
            const value = node?.val ? node.val : {};
            return Object.prototype.hasOwnProperty.call(value,'data-title');
        };
        
        const appendTitleMatches = (node: WalkNode) => {
            const hasTitle = checkHasTitle(node);
            if(!hasTitle) return;
            numTitlesExtracted++;
            const rootIdx = getNodeRootIdx(node.getPath());
            const title = node.val['data-title'];
            setRestSectionTitles(prev => {
                const returnArry = Array.from(prev);
                const titleObj = {idx: rootIdx, title};
                if(returnArry.includes(titleObj)) return returnArry;
                returnArry.push(titleObj);
                return returnArry;
            });

            // NOTE: stop walk if the title for the last rest-section has already been extracted
            if(numTitlesExtracted === restSections.length) throw new Break();
        }

        /**
         * Run walker, graphMode: "graph" required as rest-section objects have identical 'val' fields, making them equivalent in finiteTree mode (Default graphMode) and therefore throwing an error.
         * "Finite trees will error if an object/array reference is encountered more than once, determined by set membership of the WalkNode's val" (https://www.npmjs.com/package/walkjs)
         * traversalMode: breadth required to match title index to correct rest-section
         */
        try { 
            const walkRes = new WalkBuilder()
            .withConfig({graphMode: "graph", traversalMode: "breadth" })
            .withCallback({
                nodeTypeFilters: ['object'],
                keyFilters: [ 'props'],
                callback: appendTitleMatches,
            });
            walkRes.walk(restSections);
        } catch (err) {
            console.log(err);
        };

        // NOTE: Appends the content for each rest-section to its corresponding 'final' composed object, which contains both the title and the content
        restSections.map((content, sectionIdx) => {
            setComposedContents(prev => {
                const returnArry = Array.from(prev);
                if(sectionIdx > returnArry.length - 1) returnArry.push({title: '', content: null });
                returnArry[sectionIdx].content = content;
                return returnArry;
            });
        });
    }, [restSections]);

    useEffect(() => {
        restSectionTitles.map((titleMatch) => {
            setComposedContents(prev => {
                const returnArry = Array.from(prev);
                returnArry[titleMatch.idx].title = titleMatch.title;
                return returnArry;
            });
        });
    }, [restSectionTitles]);

    const sections = composedContents.map((sectionObj) => {
        const elementContent = sectionObj.content as JSX.Element;
        // TODO: Either implement a way to avoid duplicte titles or make the keys more content aware 
        return <ColumnisedSection title={sectionObj.title} key={`${sectionObj.title}${elementContent.key}`} render={() => <>{elementContent}</>} />;
    });

    return (
        <>
            {sections}
        </>
    );
};

export default WPParsedContent;
