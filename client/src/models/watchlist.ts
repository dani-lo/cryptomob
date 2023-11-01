// import { User, UserApiData } from "./user";
import { ArticleAPiData } from "./article";
import { AuthorApiData } from "./author";
import { TagApiData } from "./tag";
import { UserApiData } from "./user";

export interface WatchlistApiData {
    watchlist_id: number;
    watchlist_name: string;
    user: UserApiData;
    articles ?: ArticleAPiData[],
    tags ?: TagApiData[],
    authors ?: AuthorApiData[],
}

export class Watchlist {
    public watchlist_id: number;
    public watchlist_name: string;
    // public user: User;

    public constructor (a: WatchlistApiData) {
        this.watchlist_id = a.watchlist_id
        this.watchlist_name = a.watchlist_name

        // this.user = new User(a.user)
    }
}