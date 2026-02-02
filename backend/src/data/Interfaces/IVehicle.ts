import {Availability} from "../Enumerations/availabilaty";
import {ILocation} from "./ILocation";

export interface IVehicle {
    id: string;
    driverId: string;
    make: string;
    model: string;
    registration: string;
    location: ILocation | null;
    availability: Availability;
}

export interface IRedisHashVehicle {
    id: string;
    driverId: string;
    make: string;
    model: string;
    registration: string;
    availability: string;
    [key: string]: string;
}

// export const IRedisVehicleToIVehicle= (rv: IRedisHashVehicle, location: ILocation): IVehicle => {
//     return{
//         ...rv,
//         availability: parseInt(rv.availability),
//         location: location,
//     }
// }