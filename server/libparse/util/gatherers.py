def gather_tag_names (rss_tags) -> list[str]:
    
    tag_names_list = []

    for rss_tag in rss_tags:
        tag_ame: str = rss_tag.term
        tag_names_list.append(tag_ame)

    return tag_names_list