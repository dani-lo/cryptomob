/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Article = {
  __typename?: 'Article';
  article_content: Scalars['String']['output'];
  article_datepub: Scalars['String']['output'];
  article_description: Scalars['String']['output'];
  article_id: Scalars['ID']['output'];
  article_link: Scalars['String']['output'];
  article_title: Scalars['String']['output'];
  author?: Maybe<Author>;
  category?: Maybe<Category>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Author = {
  __typename?: 'Author';
  articles?: Maybe<Array<Maybe<Article>>>;
  author_id: Scalars['ID']['output'];
  author_name: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  category_id: Scalars['ID']['output'];
  category_name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  article: Article;
  articles: Array<Article>;
  author: Author;
  authors: Array<Author>;
  category: Category;
  categorys: Array<Category>;
  tag: Tag;
  tags: Array<Tag>;
};


export type QueryArticleArgs = {
  article_id: Scalars['ID']['input'];
};


export type QueryAuthorArgs = {
  author_id: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  category_id: Scalars['ID']['input'];
};


export type QueryTagArgs = {
  tag_id: Scalars['ID']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  articles?: Maybe<Array<Maybe<Article>>>;
  tag_id: Scalars['ID']['output'];
  tag_name: Scalars['String']['output'];
  tag_origin: Scalars['String']['output'];
};
