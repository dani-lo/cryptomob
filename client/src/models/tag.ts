import { Article, ArticleAPiData, ArticleBase } from "./article";
import { WatchlistApiData } from "./watchlist";

enum Tag_Origin {
    'feed' = 'feed',
    'user' = 'user',
}

export interface TagApiData {
    tag_id: number;
    tag_name: string;
    tag_origin: 'feed' | 'user';
    articles ?: ArticleAPiData[];
    watchlists ?: WatchlistApiData[];
}

export class Tag {
    public tag_id: number
    public tag_name: string
    public tag_origin:  Tag_Origin
    public articles ?: ArticleBase[]

    public constructor (t: TagApiData, nest = false) {
        this.tag_id = t.tag_id
        this.tag_name = t.tag_name
        this.tag_origin = Tag_Origin[t.tag_origin]

        if (nest && t.articles) {
            this.articles = t.articles.map(a => new Article(a))
        }
    }
}