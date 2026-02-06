import {ILocation} from "./ILocation";
import {RideStatus} from "../Enumerations/RideStatus";

export interface IRide {
    id: string;
    passengerId: string;
    driverId: string;
    vehicleId: string;
    status: RideStatus;
    startLocation: ILocation;
    destination: ILocation;
    rideTimespan?: number;
    price?: number;
    // cancelReason?: string;
}

export interface IRedisRide {
    id: string;
    passengerId: string;
    driverId: string;
    vehicleId: string;
    status: string;
    startLocationLat: string;
    startLocationLng: string;
    destinationLat?: string;
    destinationLng?: string;
    startingTime: string;
    completionTime: string;
    price: string;
    [key: string]: string;
}