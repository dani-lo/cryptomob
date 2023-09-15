import { DataSource } from 'apollo-datasource'

export class ArticleService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    getAuthors() {
        return Promise.resolve(authors);
    }

    getAuthor(authorId: number) {
        return Promise.resolve(findAuthor(authorId));
    }

    getAuthorArticles(author_id: number) {
        const filteredAtricles = articles
            .filter(article => article.author_id === author_id)

        return Promise.resolve(filteredAtricles);
    }

    // createAuthor(authorInput) {
    //     const author = Object.assign({}, authorInput, { id: newId() });
    //     authors.push(author);
    //     return Promise.resolve(author);
    // }

    // updateAuthor(authorId, authorInput) {
    //     let author = findAuthor(authorId);
    //     author = author ? Object.assign(author, authorInput) : null;
    //     return Promise.resolve(author);
    // }

    getTags() {
        return Promise.resolve(tags);
    }

    getTag(id: number) {
        return Promise.resolve(findTag(id));
    }

    getTagArticles(tag_id: number) {
        const filteredAtricles = articlesTags
            .filter(at => at.tag_id === tag_id) || []

        return Promise.resolve(filteredAtricles);
    }

    // getPublisherBooks(publisherId) {
    //     return Promise.resolve(
    //         books.filter(book => book.publisherId === publisherId)
    //     );
    // }

    // createPublisher(publisherInput) {
    //     const publisher = Object.assign({}, publisherInput, { id: newId() });
    //     publishers.push(publisher);
    //     return Promise.resolve(publisher);
    // }

    // updatePublisher(publisherId, publisherInput) {
    //     let publisher = findPublisher(publisherId);
    //     publisher = publisher ? Object.assign(publisher, publisherInput) : null;
    //     return Promise.resolve(publisher);
    // }

    getArticles() {
        return Promise.resolve(articles);
    }

    getArticle(id: number) {
        return Promise.resolve(findArticle(id));
    }

    getArticleTags(articleId: number) {
        const tags = articlesTags.filter(at => at.article_id == articleId)

        return Promise.resolve(tags);
    }

    getArticleAuthor(article_id: number) {
        const article = findArticle(article_id)
        const author =  article ? authors.find(a => a.author_id == article.author_id) : null
        return Promise.resolve(author);
    }

    // createBook(bookInput, publisherId) {
    //     const book = Object.assign({}, bookInput, { id: newId(), publisherId });
    //     books.push(book);
    //     return Promise.resolve(book);
    // }

    // updateBook(bookId, bookInput, publisherId) {
    //     let book = findBook(bookId);
    //     book = book ? Object.assign(book, bookInput) : null;
    //     if (book) {
    //         book = Object.assign(book, bookInput, { publisherId: publisherId });
    //     }
    //     return Promise.resolve(book);
    // }

    // setBookAuthors(bookId, authorIds) {
    //     const book = findBook(bookId);
    //     if (book) {
    //         // Remove current book authors
    //         bookAuthors = bookAuthors.filter(
    //             bookAuthor => bookAuthor.bookId !== bookId
    //         );

    //         // Add new book authors
    //         authorIds.forEach(authorId => {
    //             bookAuthors.push({
    //                 id: `${bookId}-${authorId}`,
    //                 bookId: bookId,
    //                 authorId: authorId
    //             });
    //         });
    //     }
    //     return Promise.resolve(book);
    // }
}

// ----- Helper Functions -----
function newId() {
    return Math.random()
        .toString(36)
        .substring(7);
}

function findAuthor(id: number) {
    return authors.find(author => author.author_id === id);
}

function findTag(id: number) {
    return tags.find(tag => tag.tag_id === id);
}

function findArticle(id: number) {
    return articles.find(article => article.article_id === id);
}

// ----- Initial Data -----
let authors = [
    {
        author_id: 1,
        author_name: 'Erich Gamma'
    },
    {
        author_id: 2,
        author_name: 'Richard Helm'
    },
    {
        author_id: 3,
        author_name: 'Ralph Johnson'
    },
    {
        author_id: 4,
        author_name: 'John Vlissauthor_ides'
    },
    {
        author_id: 5,
        author_name: 'Martin Fowler'
    },
    {
        author_id: 6,
        author_name: 'Eric Evans'
    },
    {
        author_id:7,
        author_name: 'Robert C. Martin'
    }
];

let tags = [
    {
        tag_id: 1,
        tag_name: 'price fluctuations'
    },
    {
        tag_id: 2,
        tag_name: 'doge and more'
    },
    {
        tag_id: 3,
        tag_name: 'cryptoman resources'
    },
    {
        tag_id: 4,
        tag_name: 'latest news cycle'
    },
    {
        tag_id: 5,
        tag_name: 'markets'
    },
    {
        tag_id: 6,
        tag_name: 'regulations'
    },
    {
        tag_id: 7,
        tag_name: 'meme coins'
    },
    {
        tag_id: 8,
        tag_name: 'IPOs and other news'
    },
    {
        tag_id: 9,
        tag_name: 'blockchain'
    },
    {
        tag_id: 10,
        tag_name: 'ethereum'
    }
];

let articles = [
    {
        article_id:  1,
        article_title: 'Design Patterns - Elements of Reusable Object-Oriented Software',
        article_link: 'addison-wesley',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 1
    },
    {
        article_id:2,
        article_title: 'Refactoring - Improving the Design of Existing Code',
        article_link: 'addison-wesley',
        author_id: 1
    },
    {
        article_id: 3,
        article_title: 'Patterns of Enterprise Application Architecture',
        article_link: 'addison-wesley',
        author_id: 1
    },
    {
        article_id: 4,
        article_title: 'Domain-Driven Design',
        article_link: 'addison-wesley',
        author_id: 1
    },
    {
        article_id: 5,
        article_title: 'Clean Code - A Handbook of Agile Software Craftsmanship',
        article_link: 'prentice-hall',
        author_id: 1
    },
    {
        article_id: 6,
        article_title: 'Agile Software Development, Principles, Patterns, and Practices',
        article_link: 'pearson',
        author_id: 1
    }
];

let articlesTags = [
    {
        id: 1,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 2,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 3,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 4,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 5,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 6,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 7,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 8,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 9,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 10,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 11,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 12,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 13,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 14,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 15,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 16,
        article_id: 1,
        tag_id: 3
    },
];
