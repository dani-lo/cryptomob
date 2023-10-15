import { Article } from '@prisma/client';
import { PaginationQueryParams } from '.';
import { dataSources } from '../datasources';

export default {
    Query: {

        async authors(_parent: any, args: { params: PaginationQueryParams }) {

            return await dataSources.authorService.getAuthors(
                args.params.whereTags || null, 
                args.params.whereCategories || null
            )
        }
    },

    Author: {
        articles(parent: { author_id:  number }) {
            return dataSources.articleService.getAuthorArticles(parent.author_id);
        },
        watchlists(parent: { author_id:  number }) {
            return dataSources.watchlistService.getWatchlistAuthors(parent.author_id);
        }
    }
};

// type IsSubtypeOf<S, P> = S extends P ? true : false;

// class User {
//     username: string;
  
//     constructor(username: string) {
//       this.username = username;
//     }
//   }
  
//   class Admin extends User {
//     isSuperAdmin: boolean;
  
//     constructor(username: string, isSuperAdmin: boolean) {
//       super(username);
//       this.isSuperAdmin = isSuperAdmin;
//     }
//   }

  
// type f = IsSubtypeOf<Admin, User>

// type SubtypeFunc = (p: string) => '1' | '2';
// type BaseFunc = (p: '1' | '2') => string;  

// type c = IsSubtypeOf<SubtypeFunc, BaseFunc>
// type l = IsSubtypeOf<Admin, User>

// type doh = IsSubtypeOf<'1' | '3', string>

// const goo = (d: Admin) => console.log(d)
// const zoo = (d: User) => console.log(d)

// type dohhhhh = IsSubtypeOf<typeof zoo, typeof goo>

// const h = new User('wewewe')
// const k = new Admin('oooooooo', true)

// zoo(k)

// const a =  { f: 23 }
// const b =  { f: 55, g: 9}
// const c = { k: 8}

// type R = IsSubtypeOf<typeof b, typeof a>