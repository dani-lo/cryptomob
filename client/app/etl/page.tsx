"use client"
import {  Suspense } from 'react'

import { cnPage, utils } from '@/src/styles/classnames.tailwind' 

import { GhostGenTextualLoader } from '@/components/widgets/status/loading'
import { EtlScreenComponent } from '@/components/etl/etlScreen'

const EtlPage = () => {
    
    return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostGenTextualLoader section="etl" />
        }
      >
        <EtlScreenComponent  />
      </Suspense>
  </div>
}

export default EtlPage