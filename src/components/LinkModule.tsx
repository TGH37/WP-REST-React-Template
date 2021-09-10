import React, { ReactElement, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// import { useSpring, animated } from 'react-spring';

import styles from 'src/styles/mainContent.module.scss';

interface stdModule {
    title: string
    href?: string
    content: ReactElement
    isExpandable: boolean
    exerpt?: string
}

interface Props {
    data: stdModule
};

const LinkModule = (props: Props) => {
    const { data } = props;
    const { title, href, content: rawContent, isExpandable, } = data;

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const exerptRef = useRef<HTMLParagraphElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const moduleContainerRef = useRef<HTMLDivElement>(null);

    const [exerptElInitialHeight, setExerptHeight] = useState<number | null>(null);
    const [contentElInitialHeight, setContentHeight] = useState<number | null>(null);

    let exRef = exerptRef.current, conRef = contentRef.current, modRef = moduleContainerRef.current;
    
    const exerpt: ReactElement = isExpandable ? <p ref={exerptRef} className={`${styles.excerpt} ${isExpanded ? styles.hidden : ""}`}>{data?.exerpt ? data.exerpt : "Exerpt"}...</p> : <></>;
    const content: ReactElement = <div ref={contentRef} className={styles.subModuleContent}>{rawContent}</div>;
    
    
    useEffect(() => {
        exRef = exerptRef.current;
        conRef = contentRef.current;
        modRef = moduleContainerRef.current;
        initModuleAndChildHeights();
    }, []);
    
    useEffect(() => {
        updateElementSizes();
    }, [isExpanded]);
    
    const updateElementSizes = (): void => {
        if(!isExpandable || !exRef || !conRef || !modRef || exerptElInitialHeight === null || contentElInitialHeight === null) return;
        modRef?.setAttribute("style", `height: ${isExpanded ? contentElInitialHeight + exerptElInitialHeight : exerptElInitialHeight}px`)
        exRef?.setAttribute("style", `height: ${isExpanded ? "0px" : exerptElInitialHeight }`)
    }
    
    const initModuleAndChildHeights = (): void => {
        if(!isExpandable || !exRef || !conRef || !modRef) return;
        const getModuleChildHeights = () => {
            const excerptHeight = getElementHeight(exerptRef);
            const contentHeight = getElementHeight(contentRef);
            return {excerptHeight, contentHeight}
        }
        const initModuleChildHeights = () => {
            if(excerptHeight) setExerptHeight(excerptHeight);
            if(contentHeight) setContentHeight(contentHeight);
        }
        const initModuleStyleAttrForAnimation = () => {
            if(excerptHeight !== null) {
                exRef?.setAttribute("style",`height: ${excerptHeight}`);
                modRef?.setAttribute("style",`height: ${excerptHeight}`);
            };
        }

        const { excerptHeight, contentHeight } = getModuleChildHeights();
        initModuleChildHeights();
        initModuleStyleAttrForAnimation();
    }

    const getElementHeight = (elementRef: RefObject<HTMLElement>): number | null => elementRef.current ? elementRef.current.getBoundingClientRect().height + getMarginHeights(elementRef) : null;

    const getMarginHeights = (elementRef: RefObject<HTMLElement>): number => {
        if(!elementRef.current) return 0;
        const sanitizeMarginString = (value: string): string => value.split("px",1)[0];

        const marginTop = parseFloat(sanitizeMarginString(window.getComputedStyle(elementRef.current, null).marginTop));
        const marginBottom = parseFloat(sanitizeMarginString(window.getComputedStyle(elementRef.current, null).marginBottom));
        return marginTop + marginBottom;
    }

    return (
        <li className={`${styles.subModuleContainer}`} >
            <h2 className={`${styles.subModuleTitle} ${href ? "" :  styles.plainTitle}`}>{href ? <Link to={href}>{title}</Link> : title}</h2>
            <div className={`${styles.subModuleContentContainer}` } ref={moduleContainerRef}>
                {exerpt}
                {content}
            </div>
            {isExpandable ? <span className={styles.expandIcon} onClick={() => setIsExpanded(!isExpanded)}>+</span> : <></>}
        </li>
    );
};

export default LinkModule;