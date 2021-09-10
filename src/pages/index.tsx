import React from 'react'
import ColumnisedSection from '../components/ColumnisedSection'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import ModulatedContent from '../components/ModulatedContent'

interface Props {}

function Homepage(props: Props) {
    const {} = props

    return (
        <>
            {/* <Layout /> */}
            <Layout >
                
                <ColumnisedSection title="foo title" render={() => <ModulatedContent />}/>
                <ColumnisedSection title="foo title sdfvgsdgfd" render={() => <ModulatedContent />}/>
            </Layout>

            
        </>
    )
}


export default Homepage
