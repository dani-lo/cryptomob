from typing import TypedDict, Optional
from datetime import datetime, timezone
from enum import Enum

import psycopg2
import psycopg2.extras

Enum('TAG_ORIGIN', ['feed', 'user'])

class ApiAuthor(TypedDict):
    author_id: Optional[int]
    author_name: str

class ApiTag(TypedDict):
    tag_id: Optional[int]
    tag_name: str
    tag_origin: str

class ApiCategory(TypedDict):
    category_id: Optional[int]
    category_name: str

class ApiArticle(TypedDict):
    article_id: Optional[int]
    article_link: str 
    article_description: str 
    article_content: str
    article_title: str 
    article_author: Optional[int]
    article_tag: Optional[list[ApiTag]]
    article_datepub: str
    article_category: Optional[ApiCategory]

def cursor_result_to_api_tags (result) -> list[ApiTag]:
    
    tags = []

    for row in result:
                
        tag = {
            "tag_id": row["tag_id"],
            "tag_name": row["tag_name"],
            "tag_origin": row["tag_origin"],
        }

        tags.append(tag)

    return tags

def cursor_result_to_api_authors (result) -> list[ApiAuthor]:

    authors = []

    for row in result:
                
        author = {
            "author_id": row["author_id"],
            "author_name": row["author_name"],
        }

        authors.append(author)

    print("done <<<< ")
    return authors
 
def cursor_result_to_api_categories (result) -> list[ApiCategory]:
    
    catogories = []

    for row in result:
                
        catogory = {
            "catogory_id": row["catogory_id"],
            "catogory_name": row["catogory_name"],
        }

        catogories.append(catogory)

    return catogories

def cursor_result_to_article_links (result) -> list[str]:
    
    links = []

    for row in result:

        links.append(row["article_link"])

    return links

class ArticlesParser:

    #conn: psycopg2.connection
    tags: list[ApiTag]
    categories: list[ApiCategory]
    authors: list[ApiAuthor]
    article_links: list[str]

    def __init__ (self):

        try:

            self.connect()

            cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            cursor.execute("SELECT tag_id, tag_name, tag_origin FROM tags")
            fetched_tags = cursor.fetchall()

            self.tags = cursor_result_to_api_tags(fetched_tags)
            
            cursor.execute("SELECT author_id, author_name FROM authors")
            fetched_authors = cursor.fetchall()

            self.authors = cursor_result_to_api_authors(fetched_authors)

            cursor.execute("SELECT category_id, category_name FROM categories")
            fetched_categories = cursor.fetchall()

            self.categories = cursor_result_to_api_categories(fetched_categories)

            cursor.execute("SELECT article_link FROM articles")
            fetched_article_links = cursor.fetchall()

            self.article_links = cursor_result_to_article_links(fetched_article_links)

        except (Exception, psycopg2.DatabaseError) as error:
            print('__init__ ERROR')
            print(error)
            # if hasattr(self, 'conn') and self.conn is not None:
            #     self.conn.close()            

    def connect (self) :

        if not hasattr(self, "conn") or self.conn is None:
            self.conn = psycopg2.connect(database="cryptomob",
                        host="localhost",
                        user="cryptomob_user",
                        password="cryptomob_pass",
                        port="5432")
            
    def disconnect (self) :
        if hasattr(self, 'conn') and self.conn is not None:
            self.conn.close()

    def get_tags_or_create (self, tag_names: list[str]) -> list[ApiTag]:

        new_tags = []
        existing_tags = []

        for name in tag_names:
            
            search_tag_name = name.lower()
            api_tag = next((item for item in self.tags if item["tag_name"] == search_tag_name), None)

            if api_tag is None:

                tag_to_save: ApiTag = {
                    "tag_id": None,
                    "tag_name": name,
                    "tag_origin": "feed"
                }

                new_tags.append(tag_to_save)
            else:
                existing_tags.append(api_tag)

        if len(tag_names) == 0:
            return existing_tags

        if len(new_tags) > 0:

            # print(">> we have new tags")
            result = self.save_tags(new_tags)

            if result == None:
                return existing_tags
            
            self.tags = result

            return result
        
        else:
            # print(">> NO new tags")

            existing_tags.extend(new_tags)

            return existing_tags
    
    def get_author_or_create (self, author: str) -> ApiAuthor | None:
        
        # print("GET AUTHOR OR ELSEEEEEEEE")
        # print(author)

        author_name = author.lower()

        existing_api_author = next((item for item in self.authors if item["author_name"] == author_name), None)

        # print("(existing author::::)", existing_api_author)

        if existing_api_author is None:
            
            author_to_save: ApiAuthor = {
                "author_id": None,
                "author_name": author_name,
            }

            # print(".. author to save", author_to_save)

            result = self.save_author(author_to_save)
            
            if result == None:
                return None
             
            self.authors = result

            return next((item for item in self.authors if item["author_name"] == author_name), None)
        
        return existing_api_author


    def save_tags (self, tags: list[ApiTag]) -> list[ApiTag] | None :

        values = []

        # print('>>>>>>>> SAVE TAGS ====')

        try:
            for tag in tags:
                save_tag_name = tag["tag_name"].lower()
                values.append((save_tag_name, tag["tag_origin"]))
            
            self.connect()

            cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            cursor.executemany("INSERT INTO tags(tag_name, tag_origin) VALUES(%s,%s)", values)
            
            self.conn.commit()

            cursor.execute("SELECT tag_id, tag_name, tag_origin FROM tags")

            fetched_tags = cursor.fetchall()

            # print(fetched_tags)

            all_tags: list[ApiTag] = cursor_result_to_api_tags(fetched_tags)

            return all_tags

        except (Exception, psycopg2.DatabaseError) as error:
            print('save tags errored')
            print(error)
            # if self.conn is not None:
            #     self.conn.close()  

            return None
        
    def save_author (self, author: ApiAuthor) -> list[ApiAuthor] | None :

        # print("-- save author")

        author_name = author["author_name"]

        sql = """INSERT INTO authors(author_name)
            VALUES(%s);"""
        
        print(author_name)

        try:

            self.connect()

            cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cursor.execute(sql, (author_name,))
            
            self.conn.commit()

            cursor.execute("SELECT author_id, author_name FROM authors")
            
            fetched_authors = cursor.fetchall()
            
            all_authors:list[ApiAuthor] = cursor_result_to_api_authors(fetched_authors)
 
            return all_authors

        except (Exception, psycopg2.DatabaseError) as error:
            print('save author errored')
            print(error)

            # if self.conn is not None:
            #     self.conn.close()  

            return None

    # def find_author_by_name (self, author: ApiAuthor) -> None :
    #     pass

    # def save_author (self, author: ApiAuthor) -> None :
    #     pass

    # def get_authors (self) -> None:
    #     pass

    # def get_tags (self) -> None:
    #     pass

    # def get_categories (self) -> None:
    #     pass

    def save_article (self, article: ApiArticle) -> int | None : 

        if article["article_link"] in self.article_links:
            return 
        
        try:
            self.connect()

            article_author = article["article_author"] if article["article_author"] != 0 else None

            values = (
                article["article_title"],
                article["article_link"],
                article["article_content"],
                article["article_description"],
                article["article_datepub"],
                article["article_author"]
            )

            cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            cursor.execute("""INSERT INTO articles(
                        article_title,
                        article_link,
                        article_content,
                        article_description,
                        article_datepub,
                        author_id) 
                        VALUES(%s, %s, %s, %s, %s, %s)
                        ON CONFLICT ON CONSTRAINT articles_article_link_key DO NOTHING
                        RETURNING article_id;""", values)

            article_id_row = cursor.fetchone()
            article_id = article_id_row["article_id"]

            self.conn.commit()

            # print("Saved article IDDDDDD", article_id)

            self.article_links.append(article["article_link"])

            return article_id
        
        except (Exception, psycopg2.DatabaseError) as error:
            print('save article errored')
            print(error)

            # if self.conn is not None:
            #     self.conn.close()  

            return None

        # saved_article =

    def save_article_tags (self, article_id: ApiArticle, tag_names: list[str]):

        print("-------- save_article_tags ------ passed tags VS self.tags")

        sql = """INSERT INTO articles_tags(article_id, tag_id) VALUES(%s, %s);"""

        tag_ids = []

        for name in tag_names:
            api_tag = next((item for item in self.tags if item["tag_name"].lower() == name.lower()), None)
            
            tag_ids.append(api_tag["tag_id"])

        values = []

        print(">> FOUND API TAGS:::")
        print(tag_ids)

        for tag_id in tag_ids:
            if not (article_id, tag_id) in values:
                values.append((article_id, tag_id))
        
        print("SAVE THESE")
        print(values)
        
        try:

            self.connect()

            cursor = self.conn.cursor()
            cursor.executemany(sql, values)
            
            self.conn.commit()

        except (Exception, psycopg2.DatabaseError) as error:
            print('save_article_tags errored')
            print(error)

            # if self.conn is not None:
            #     self.conn.close()  

            return None


        

        

