# from datetime import datetime
# from typing import Optional

# from orm import ApiArticle, ApiAuthor, ApiCategory
# from util.manage_date import sql_str_to_datetime

# class Author:

#     id: int
#     name: str

#     def __init__(
#             self, 
#             api_author: ApiAuthor
#     ) -> None:

#         if api_author['author_id']:
#                 self.id = api_author['author_id']
#         else:
#                 self.id = 0

#         self.name = api_author['author_name']

# class Category:

#     id: int
#     name: str

#     def __init__(
#             self, 
#             api_category: ApiCategory
#     ) -> None:

#         if api_category['category_id']:
#                 self.id = api_category['category_id']
#         else:
#                 self.id = 0
#         self.name =api_category['category_name']

# class Article:

#     id: int
#     link: str 
#     description: str 
#     content: str
#     title: str 
#     author: Author
#     category:  Optional[Category]
    
#     date_pub: datetime

#     def __init__(
#             self, 
#             api_article: ApiArticle,
#             api_author: ApiAuthor,
#             api_category: ApiCategory
#         ) -> None:
        
#         if api_article['article_id']:
#                 self.id = api_article['article_id']
#         else:
#                 self.id = 0

#         self.link = api_article['article_link']
#         self.description = api_article['article_description'] 
#         self.content = api_article['article_content'] 
#         self.author = Author(api_author)
#         self.category = Category(api_category)
#         self.date_pub =  sql_str_to_datetime(api_article['article_datepub'])
#         self.title = api_article['article_title']

 
