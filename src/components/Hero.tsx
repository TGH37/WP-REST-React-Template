import React, { useContext } from 'react';
import styles from 'src/styles/hero.module.scss';
import {BreakpointContext} from '../contexts/MediaBreakpointCtx';


// images
import HeroLHSImg500 from 'src/assets/imgs/heroLHS_500.png';
import HeroLHSImg768 from 'src/assets/imgs/heroLHS_768.png';
import HeroLHSImg1500 from 'src/assets/imgs/heroLHS_1500.png';

import HeroBannerImg500 from 'src/assets/imgs/hero-banner-500.jpg';
import HeroBannerImg1000 from 'src/assets/imgs/hero-banner-1000.jpg';
import HeroBannerImg1500 from 'src/assets/imgs/hero-banner-1500.jpg';
import { GlobalCtx } from '../contexts/GlobalCtx';

interface Props {};

function Hero(props: Props) {
    const {} = props;
    const { queries, queryMatch } = useContext(BreakpointContext);
    // const { isNavExpanded } = useContext(GlobalCtx);


    return (
        <div className={styles.heroContainer}>
            {/* {   queryMatch?.sm ? 
                <img 
                    src={HeroLHSImg500} 
                    alt="foo"
                    className={`${styles.heroLHSImg} ${""}`}
                    srcSet={`
                        ${HeroLHSImg500} 409w,
                        ${HeroLHSImg768} 628w,
                        ${HeroLHSImg1500} 1227w,
                    `} 
                    sizes={`
                        ${queries.xs} ${100}vw,
                        ${queries.sm} ${30}vw,
                        ${queries.md} ${20}vw
                    `}
                />
                : <></>
            } */}
            <img 
                src={HeroBannerImg500} 
                alt="foo"
                className={`${styles.heroBannerImg} ${""}`}
                srcSet={`
                    ${HeroBannerImg500} 500w,
                    ${HeroBannerImg1000} 1000w,
                    ${HeroBannerImg1500} 1500w,
                `} 
                sizes={`
                    ${queries.sm} ${100}vw
                `}
            />
                
        </div>
    );
};

export default Hero;
