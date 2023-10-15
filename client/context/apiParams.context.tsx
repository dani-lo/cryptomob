"use client";

import React, { createContext } from "react"

import { fetchParamsAtom, protectedArticlesQueryFilterAtom, publicArticlesQueryFilterAtom } from "@/src/store/queryAtoms";


export const initialCtx = {
  queryParams:{
      articles: fetchParamsAtom
  },
  filterParams: {
      articles: {
        pub: publicArticlesQueryFilterAtom,
        protect: protectedArticlesQueryFilterAtom
      }
  }
}

export const ApiParamsContext = createContext(initialCtx)

export const ApiParamsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // const [apiParamsState] = useState(startState)
  return (
    <ApiParamsContext.Provider value={ initialCtx }>
      {children}
    </ApiParamsContext.Provider>
  );
};