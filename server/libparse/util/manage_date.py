from datetime import datetime

from dateutil.parser import parse

str_sql_time_format = '%Y-%m-%d'

def sql_str_to_datetime (sql_str: str) -> datetime :
    
    return parse(sql_str, parserinfo=None) 

def datetime_to_sql_str (dt: datetime) -> str :

    return dt.strftime(str_sql_time_format)

def rss_str_to_sql_str (rss_str: str) -> str :

    dt: datetime = parse(rss_str)

    return datetime_to_sql_str(dt)
