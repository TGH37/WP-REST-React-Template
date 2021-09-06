import React, { useEffect, useState } from 'react';
import styles from 'src/styles/layout.module.scss';
import Navbar from './Navbar';
import StaticSidebar from './StaticSidebar';
import useBreakpoint, {mediaBreakpoints} from '../hooks/useBreakpoint';
import MobileHeader from './MobileHeader';
import Footer from './Footer';


interface Props {
    children: any
};

function Layout(props: Props) {
    const { children } = props;
    const [isMobile, setIsMobile] = useState<boolean>(true);

    const mediaBreakpoints: mediaBreakpoints = useBreakpoint();
    useEffect(() => {
        if(mediaBreakpoints.md === undefined) return;
        setIsMobile(mediaBreakpoints.md);
      }, [mediaBreakpoints.md]);

    return (
        <>
            <Navbar />
            {isMobile ? <StaticSidebar /> : <MobileHeader />}
            <main className={styles.mainPageContent}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
