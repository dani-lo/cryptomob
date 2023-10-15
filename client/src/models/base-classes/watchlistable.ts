import { Constructor } from "@/src/helpers/extend"
import { Watchlist } from "@/src/models/watchlist"
import { Model } from ".."
import { MutateFunction } from "@tanstack/react-query"

export interface WithWatchlistMethods  {
    watch: (w: Watchlist, mutateFn: MutateFunction) => void
}

export const withWatchlist = <C extends Constructor<Model>>(Class: C) => {
    class Watchlisted extends  Class {

        // addToWatchlist(w: Watchlist, mutateFn: MutateFunction) {

        //     //
        // }
    }

    return Watchlisted
}