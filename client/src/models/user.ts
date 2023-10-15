export interface UserApiData {
    user_id: number;
    user_name: string;
}

export class User {
    public user_id: number;
    public user_name: string;

    public constructor (a: UserApiData) {

        this.user_id = a.user_id
        this.user_name = a.user_name
    }
}