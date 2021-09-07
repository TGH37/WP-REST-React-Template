import React from 'react'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

interface Props {}

function Homepage(props: Props) {
    const {} = props

    return (
        <>
            {/* <Layout /> */}
            <Layout >
                <Hero />
            </Layout>

            
        </>
    )
}

export default Homepage
