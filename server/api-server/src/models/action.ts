export enum ActionTypes {
    'COMMENT' = 'COMMENT',
    'DELETE' = 'DELETE',
    'ADD_ARTICLE' = 'ADD_ARTICLE',
}

export const ActionACL = {
    admin: [ActionTypes.COMMENT, ActionTypes.DELETE, ActionTypes.ADD_ARTICLE],
    logged: [ActionTypes.COMMENT],
    public: [],
}