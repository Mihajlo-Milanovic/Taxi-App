
export interface IPassenger {
    id: string;
    name: string;
    telephone: string;
}

export interface UpdatePassengerData {
    name?: string;
    telephone?: string;
}