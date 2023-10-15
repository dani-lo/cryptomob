import feedparser

# from models import Article, Category, Author
from sources.crypto import rss_sources
from orm import ApiArticle, ApiAuthor, ArticlesParser, ApiTag

from util.gatherers import gather_tag_names
from util.manage_date import rss_str_to_sql_str

def get_attr(obj, attr: str, fallback_val: str | int | bool):
    if hasattr(obj, attr):
        return obj[attr]
    else:
        return fallback_val

def try_that ():
    print("pdfdfsdfsfd")
    feed = feedparser.parse("https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml")

    # pointer = feed.entries[1]

    # print(pointer.feed)

    for entry in feed.entries:
        
        print("========================================")
        # print(entry.link)
        # print(entry.published)
        # print(entry.author)
        print(entry.author)
        # print(entry.keys())

        # if hasattr(entry, "metadata"):
        #     print(entry.metadata)
        # else:
        #     print('NOTTTT')

# print(pointer.title)
# print (strip_tags(pointer.summary))


def main ():
    # grab feeds from sources

    articles_parser = ArticlesParser()

    print(articles_parser)

    i = 0

    for rss_source in rss_sources:

        
            feed = feedparser.parse(rss_source)
    
            for entry in feed.entries:

                # if i < 3:

                #     i = i + 1

                tags_list = gather_tag_names(entry.tags) if hasattr(entry, "tags") else []
                
                articles_parser.get_tags_or_create(tags_list)

                entry_author = entry.author if hasattr(entry, "author") else "unknown"
                stored_author: ApiAuthor | None = articles_parser.get_author_or_create(entry_author)

                date_pub = rss_str_to_sql_str(entry.published)  if hasattr(entry, "published") else "2000-01-01"
                
                author_id = stored_author["author_id"] if stored_author is not None else 0
                
                content = entry.content[0].value if hasattr(entry, "content") and len(entry.content) > 0 else ""

                summary =  entry.summary if hasattr(entry, "summary") else "summary not avaliable"

                link = entry.link if hasattr(entry, "link") else "link not avaliable"

                title = entry.title if hasattr(entry, "title") else "title not avaliable"

                article: ApiArticle = {
                    "article_id": None,
                    "article_link": link,
                    "article_description":  summary,
                    "article_content": '',# no content for now, lets keep db size reasonable :-)
                    "article_title":  title,
                    "article_author": author_id,
                    "article_category": None,
                    "article_datepub": date_pub,
                    "article_tag": None,
                }

                # print(article)
                
                article_id = articles_parser.save_article(article)
                
                # print("article_id::", article_id)
                
                if article_id is not None:
                    print("> article_id is OK savng article tags")
                    articles_parser.save_article_tags(article_id, tags_list)                

main()
# try_that()