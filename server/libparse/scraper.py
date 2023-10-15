import feedparser

from xml.etree import ElementTree

from util.strip import strip_tags

import psycopg2

from models import Article, Category, Author
from server.libparse.sources.sources import rss_sources

conn = psycopg2.connect(database="crypotmob",
                        host="localhost",
                        user="postgres",
                        password="postgres",
                        port="5432")

Feed = feedparser.parse("https://www.newsbtc.com/feed/")

# print(Feed)

pointer = Feed.entries[1]

# print(pointer.title)
# print (strip_tags(pointer.summary))

class A:

    def __init__(self) -> None: 
        pass

class ApiFeedParser:

    def __init__(self) -> None:
        pass

def rss_article_parser (article: Article):
    pass



# def parse_article_from_rss (xml_article: ):
#     pass 

def parse_rss_articles (xml_articles):
    pass


