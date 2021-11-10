import React from 'react'
import { Jumbotron } from 'react-bootstrap'
import Layout from '../../Layout'

function Home() {
    return (
        <div>
            <Layout>
                <Jumbotron style={{margin:'5rem'}} className="text-center">
                    <h1>Welcome to Admin Dashboard</h1>
                </Jumbotron>
            </Layout>
        </div>
    )
}

export default Home
