import React from 'react';
import Head from 'next/head';
import '../style/global.css';

export default function App({ Component, pageProps }) {
    return (
        <React.Fragment>
            <Head>
                <title>Nextron Chat</title>
            </Head>
            <Component {...pageProps} />
        </React.Fragment>

    )
}