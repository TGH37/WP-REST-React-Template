import React, { useContext } from 'react';
import styles from '../styles/hero.module.scss';
import {BreakpointContext} from '../contexts/MediaBreakpointCtx';


// images
import HeroBannerImg500 from '../assets/imgs/hero-banner-500.jpg';
import HeroBannerImg1000 from '../assets/imgs/hero-banner-1000.jpg';
import HeroBannerImg1500 from '../assets/imgs/hero-banner-1500.jpg';

interface Props {};

function Hero(props: Props) {
    const {} = props;
    const { queries, queryMatch } = useContext(BreakpointContext);


    return (
        <div className={styles.heroContainer}>
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
