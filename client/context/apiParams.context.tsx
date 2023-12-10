"use client";

import React, { createContext } from "react"

import { 
  fetchArticlesParamsAtom, 
  fetchTagsParamsAtom, 
  fetchAuthorsParamsAtom, 
  protectedArticlesQueryFilterAtom, 
  publicArticlesQueryFilterAtom 
} from "@/src/store/queryAtoms";

export const initialCtx = {
  queryParams:{
      articles: fetchArticlesParamsAtom,
      tags: fetchTagsParamsAtom,
      authors: fetchAuthorsParamsAtom
  },
  filterParams: {
      articles: {
        pub: publicArticlesQueryFilterAtom,
        protect: protectedArticlesQueryFilterAtom,
      }
  }
}

export const ApiParamsContext = createContext(initialCtx)

export const ApiParamsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (
    <ApiParamsContext.Provider value={ initialCtx }>
      {children}
    </ApiParamsContext.Provider>
  );
};