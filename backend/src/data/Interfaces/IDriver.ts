
export interface IDriver {
    id: string;
    firstName: string;
    lastName: string;
}

export interface IRedisDriver {
    id: string;
    firstName: string;
    lastName: string;
    [key: string]: string;
}