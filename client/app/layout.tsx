import { Metadata } from 'next'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import '../styles/global.css'

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
    }:{
        children: React.ReactNode
    }) {

    return <html lang="en">
        <body>{children}</body>
    </html>
}
 
export const metadata: Metadata = {
    title: 'Home',
    description: 'Welcome to Next.js',
}

// import type { ReactElement, ReactNode } from 'react'
// import type { NextPage } from 'next'
// import { AppProps } from 'next/app'
// import { Layout } from '@/components'
// import '@/styles/global.css'

// export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode
// }

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout
// }

// export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
//   const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

//   return getLayout(<Component {...pageProps} />)
// }
