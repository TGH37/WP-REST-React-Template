import React, { useContext } from 'react';
import styles from 'src/styles/hero.module.scss'
import HeroImg500 from 'src/assets/imgs/heroLHS_500.png'
// import HeroImg768 from 'src/assets/imgs/heroLHS_768.png'
import HeroImg768 from 'src/assets/imgs/Hero.jpg'
import HeroImg1500 from 'src/assets/imgs/heroLHS_1500.png'
import {BreakpointContext} from '../contexts/MediaBreakpointCtx';

interface Props {};

function Hero(props: Props) {
    const {} = props;
    // const { queries } = useContext(BreakpointContext)
    return (
        <div className={styles.heroContainer}>
            <img src={HeroImg768} 
                alt="foo" 
                srcSet={`
                    ${HeroImg500} 500w,
                    ${HeroImg768} 768w,
                    ${HeroImg500} 1500w,
                `} 
                sizes={`(min-width: ${768}px) ${50}w`}
            />
                
        </div>
    );
};

export default Hero;
