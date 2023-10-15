export interface HashtagApiData {
    hashtag_id: number;
    hashtag_name: string;
}

export class Hashtag {
    public hashtag_id: number;
    public hashtag_name: string;

    public constructor (a: HashtagApiData) {
        this.hashtag_id = a.hashtag_id
        this.hashtag_name = a.hashtag_name
    }
}