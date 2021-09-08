import React, { useEffect, useState } from 'react';
import styles from 'src/styles/layout.module.scss';
import Navbar from './Navbar';
import StaticSidebar from './StaticSidebar';
import useBreakpoint, {mediaBreakpoints} from '../hooks/useBreakpoint';
import MobileHeader from './MobileHeader';
import Footer from './Footer';
import Hero from './Hero';


interface Props {
    children: any
};

function Layout(props: Props) {
    const { children } = props;
    const [isMobile, setIsMobile] = useState<boolean>(true);

    const {queryMatch: mediaBreakpoints} = useBreakpoint();

    useEffect(() => {
        if(!mediaBreakpoints || mediaBreakpoints.md === undefined) return;
        setIsMobile(mediaBreakpoints.md);
      }, [mediaBreakpoints?.md]);

    return (
        <>
            <Navbar />
            {isMobile ? <StaticSidebar /> : <MobileHeader />}
            <Hero />
            <main className={styles.mainPageContent}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
