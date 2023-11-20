

import sys
import feedparser
import json

# from models import Article, Category, Author
from sources.crypto import rss_sources as crypto_rss_sources
from sources.crypto import app_id as crypto_app_id

from sources.fullstack import rss_sources as fullstack_rss_sources
from sources.fullstack import app_id as fullstack_app_id


# from orm import ApiArticle, ApiAuthor, ArticlesParser, ApiTag
from orm import ArticlesParser

from util.gatherers import gather_tag_names
from util.manage_date import rss_str_to_sql_str
from util.strip import strip_tags
# from util.cli_helper import bcolors

app_id = 0

if len(sys.argv) > 1 and sys.argv[1] == '--app-id':
    app_id = int(sys.argv[2])

# def get_attr(obj, attr: str, fallback_val: str | int | bool):
def get_attr(obj, attr, fallback_val):
    
    if hasattr(obj, attr):
        return obj[attr]
    else:
        return fallback_val


def main ():

    if int(app_id) == 0:
        print("Error invoking script:")
        print("Must specify and app id (--app-id flag)")
        sys.exit()
 
    
    articles_parser = ArticlesParser(port=5432)
    
    use_rss_sources = fullstack_rss_sources if app_id == fullstack_app_id else crypto_rss_sources

    res = []

    for rss_source in use_rss_sources:

        # print(rss_source)

        feed = feedparser.parse(rss_source)
        # print(len(feed.entries))

        for entry in feed.entries:

            tags_list = gather_tag_names(entry.tags) if hasattr(entry, "tags") else []
            
            articles_parser.get_tags_or_create(tags_list)

            entry_author = entry.author if hasattr(entry, "author") else "unknown"
            # stored_author: ApiAuthor | None = articles_parser.get_author_or_create(entry_author)
            stored_author = articles_parser.get_author_or_create(entry_author)

            date_pub = rss_str_to_sql_str(entry.published)  if hasattr(entry, "published") else "2000-01-01"
            
            author_id = stored_author["author_id"] if stored_author is not None else 0
            
            # content = entry.content[0].value if hasattr(entry, "content") and len(entry.content) > 0 else ""

            summary =  strip_tags(entry.summary) if hasattr(entry, "summary") else "summary not avaliable"

            link = strip_tags(entry.link) if hasattr(entry, "link") else "link not avaliable"

            title = strip_tags(entry.title) if hasattr(entry, "title") else "title not avaliable"

            # article: ApiArticle = {
            #     "article_id": None,
            #     "article_link": link,
            #     "article_description":  summary,
            #     "article_content": '',# no content for now, lets keep db size reasonable :-)
            #     "article_title":  title,
            #     "article_author": author_id,
            #     "article_category": None,
            #     "article_datepub": date_pub,
            #     "article_tag": None,
            #     "article_app": app_id
            # }

            article = {
                "article_id": None,
                "article_link": link,
                "article_description": summary,
                "article_content": '',# no content for now, lets keep db size reasonable :-)
                "article_title": title,
                "article_author": author_id,
                "article_category": None,
                "article_datepub": date_pub,
                "article_tag": None,
                "article_app": app_id
            }

            # print(article)
            
            article_id = articles_parser.save_article(article)
            
            # print("article_id::", article_id)
            
            res.append(article)
            
            if article_id is not None:
                # print("> article_id is OK savng article tags")
                articles_parser.save_article_tags(article_id, tags_list)                
    
                

    json.dump(res, sys.stdout)
    sys.stdout.flush()
    
main()