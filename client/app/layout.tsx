import { Metadata } from 'next'

import { config as faCssConfig } from "@fortawesome/fontawesome-svg-core"
import 'react-dropdown/style.css'

import "@fortawesome/fontawesome-svg-core/styles.css"
import "react-datepicker/dist/react-datepicker.css"

import '@/src/styles/global.css'

import Providers from "@/src/utils/provider"

import { ApiParamsContextProvider } from '@/context/apiParams.context'

import { HeaderComponent } from '@/components/header'
import { TailwindHiddenLoaderComponent } from '@/components/tailwindHiddenLoader'

faCssConfig.autoAddCss = false

export default function RootLayout({
    children,
    }:{
        children: React.ReactNode
    }) {
    
    return <html lang="en">
        <body>
            <TailwindHiddenLoaderComponent />
            <HeaderComponent />
            <Providers>
                <ApiParamsContextProvider>
                    {children}
                </ApiParamsContextProvider>
            </Providers>
            {/* <script async type="text/javascript" src="/sticky.js" /> */}
        </body>
    
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
