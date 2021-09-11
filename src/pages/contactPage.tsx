import React from 'react';
import Layout from '../components/Layout';
import PageContentColumns from '../components/PageContentColumns';
import HeroBannerImg1500 from 'src/assets/imgs/hero-banner-1500.jpg';
import LinkModule from '../components/LinkModule';

interface Props {};

function ContactPage(props: Props) {
    const {} = props;

    const title = "Get in Touch"
    return (
        <>
            <PageContentColumns title={title}>
                <>
                    <h2>This is the content title</h2>
                    <p>this is the content</p>
                    <p>this is the content</p>
                    <p>this is the content</p>
                    <img src={HeroBannerImg1500} alt="" />
                    <LinkModule data={{title: "hehe", isExpandable: true, content:<><p>the content</p></>}}/>
                </>
            </PageContentColumns>
        </>
    );
};

export default ContactPage;
