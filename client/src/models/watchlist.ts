// import { User, UserApiData } from "./user";
import { UserApiData } from "./user";

export interface WatchlistApiData {
    watchlist_id: number;
    watchlist_name: string;
    user: UserApiData;
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