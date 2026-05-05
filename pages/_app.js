import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
      })
    }
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#c4a96b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DownRange" />
        <meta name="description" content="Precision ballistics calculator with bullet database, trajectory calculator, and wind calls for long range shooters." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>DownRange — Precision Ballistics Calculator</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
