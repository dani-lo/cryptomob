import { ArticleService } from './articleService'
import { CommentService  } from './commentService'
import { UserService } from './userService'
import { TagService } from './tagService'
import { WatchlistService } from './watchlistService'
import { CategoryService } from './categoriesService'
import { CoinService } from './coinService'
import { AuthorService } from './authorService'
import { EtlService } from './etlService'
import { MetaService } from './metaService'

export const dataSources = {
    articleService: new ArticleService(),
    commentService: new CommentService(),
    userService: new UserService(),
    tagService: new TagService(),
    watchlistService: new WatchlistService(),
    categoryService: new CategoryService(),
    coinService: new CoinService(),
    authorService: new AuthorService(),
    etlService: new EtlService(),
    metaService: new MetaService()
}