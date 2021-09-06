import React from 'react';
import styles from 'src/styles/layout.module.scss';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface Props {};

function Footer(props: Props) {
    const {} = props;
    const companyName = "COMPANY"

    return (
        <footer className={styles.footerContainer}>
            <SearchBar />
            <div className={`${styles.footerFlexSectionContainer}`}>
                <div className={`${styles.footerFlexSection} ${styles.footerAddress}`}>
                    <p>HEAD OFFICE</p>
                    <p>Address Line 1<br/>Address Line 2<br/>City, POSTCODE<br/>United Kingdom</p>
                    <p>T +44123456789<br/>E email@address.com</p>
                </div>
                <div className={`${styles.footerFlexSection} ${styles.footerLegalNav}`}>
                    <Link to="/privacy-policy"><a>Privacy Policy</a></Link>
                    <Link to="/terms-of-service"><a>Terms of Service</a></Link>
                    <Link to="/cookie-policy"><a>Cookie Policy</a></Link>
                </div>
            </div>
            <div>
                <p>DISCLAIMER</p>
                <sub>&copy; {companyName} 2021, All Rights Reserved.</sub>
            </div>
      </footer>
    );
};

export default Footer;
