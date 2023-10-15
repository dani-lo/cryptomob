import { UserApiData } from "./user";

export interface CategoryApiData {
    category_id: number;
    category_name: string;
    user ?: UserApiData;
}

export class Category {
    public category_id: number;
    public category_name: string;

    public constructor (a: CategoryApiData) {
        this.category_id = a.category_id
        this.category_name = a.category_name
    }
}