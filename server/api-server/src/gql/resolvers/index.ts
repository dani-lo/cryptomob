import articleResolver from "./articleResolver"
import authorResolver from "./authorResolver"
import tagResolver from "./tagResolver"

export const resolvers = {
    'article': articleResolver,
    'author':authorResolver,
    'tag': tagResolver,
}