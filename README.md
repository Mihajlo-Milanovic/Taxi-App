# Taxi-App with Redis

## Running the Application
```bash
cd Taxi-App/backend
npm install
npm run build
npm run dev
```

The server will start on **http://localhost:5000**

Once the application is running, access the interactive Swagger documentation at **http://localhost:5000/docs**

Swagger UI provides:
- Request and response schemas
- Interactive API testing
- Example requests and responses

---
## How the Application Works

The system simulates a taxi dispatch workflow:

1. **A passenger is created.**
2. **A driver and vehicle are created.**
3. **Vehicles have availability status:**

| Value | Status |
|-------|--------|
| `0` | Offline |
| `1` | Available |
| `2` | Occupied |

4. **When a ride is requested:**
   - The system searches for the nearest available vehicle using Redis GEO search.
   - A ride record is created.
   - Vehicle status changes to `occupied`.

5. **When the ride is completed:**
   - Vehicle status returns to `available`.
   - Active ride references are removed.

**Redis is used for:**
- Fast key-value storage
- Geospatial indexing
- Active ride tracking

## Used Redis Data Structures

### 1. Drivers
| Key | Type | Description |
|-----|------|-------------|
| `driver:{driverId}` | Hash | Stores driver profile information |
| `driver:{driverId}:active-ride` | String | Stores the ID of the currently active ride for the driver |

### 2. Passengers
| Key | Type | Description |
|-----|------|-------------|
| `passenger:{passengerId}` | Hash | Stores passenger profile information |
| `passenger:{passengerId}:active-ride` | String | Stores the ID of the currently active ride for the passenger |

### 3. Vehicles
| Key | Type | Description |
|-----|------|-------------|
| `vehicles:{vehicleId}` | Hash | Stores vehicle data |
| `vehicles:{vehicleId}:active-ride` | String | Stores the ID of the currently active ride assigned to the vehicle |
| `vehicles:0` | Geo Set | Offline vehicles |
| `vehicles:1` | Geo Set | Available vehicles |
| `vehicles:2` | Geo Set | Occupied vehicles |

> Each Geo Set stores vehicle locations using Redis GEO commands, enabling proximity search for available vehicles.

### 4. Rides
| Key | Type | Description |
|-----|------|-------------|
| `ride:{rideId}` | Hash | Stores ride information |

### 5. Availability Logic
Vehicle availability is managed using the `availability` field and Redis GEO sets.

---

## Ride Status Codes

| Status | Value | Description |
|--------|-------|-------------|
| Cancelled | `-1` | Ride was cancelled before completion |
| Requested | `0` | Ride created, waiting for driver |
| Accepted | `1` | Driver accepted the ride |
| InProgress | `2` | Ride has started |
| Finished | `3` | Ride successfully completed |
