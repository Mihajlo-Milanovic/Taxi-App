export interface IRide {
    id: string;
    passengerId: string;
    driverId?: string;
    vehicleId?: string;
    status: 'requested' | 'accepted' | 'in_progress' | 'finished' | 'cancelled';
    startLatitude: string;
    startLongitude: string;
    destinationLatitude?: string;
    destinationLongitude?: string;
    price?: string;
    cancelReason?: string;
}

export interface CreateRideData {
    passengerId: string;
    startLatitude: number;
    startLongitude: number;
    destinationLatitude?: number;
    destinationLongitude?: number;
    price?: number;
}