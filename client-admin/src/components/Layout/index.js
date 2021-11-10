import React from 'react'
import Header from '../Header'

function Layout(props) {
    return (
        <>
            <Header/>
            {props.children}
        </>
    )
}

export default Layout
