###  Taxi-App with Redis

### Running the Application

```bash
cd backend
npm run build
npm run dev
```

The server will start on **http://localhost:5000**

Once the application is running, access the interactive Swagger documentation at **http://localhost:5000/docs**

### Swagger UI Features

- Request/response schemas
- Interactive API testing
- Example requests and responses

### Used Redis data structure
1. Drivers<br>
  - Hash <br>
  driver:{driverId} - Stores driver profile information.<br>
 - String<br>
  driver:{driverId}:active-ride - Stores the ID of the currently active ride for the driver.<br><br>
2. Passengers<br>
- Hash<br>
passenger:{passengerId} - Stores passenger profile information.<br>
- String <br>
passenger:{passengerId}:active-ride - Stores the ID of the currently active ride for the passenger.<br><br>
3. Vehicles<br>
- Hash<br>
vehicles:{vehicleId} - Stores vehicle data.<br>
- Geo Sets (location indexing by availability)<br>
vehicles:0   // offline vehicles<br>
vehicles:1   // available vehicles<br>
vehicles:2   // occupied vehicles<br>
Each Geo Set stores vehicle locations using Redis GEO commands, enabling proximity search for available vehicles.<br>
- String<br>
vehicles:{vehicleId}:active-ride - Stores the ID of the currently active ride assigned to the vehicle.<br><br>
4. Rides<br>
- Hash<br>
ride:{rideId} - Stores ride information.<br><br>

5. Availability Logic<br>
Vehicle availability is managed using the availability field and Redis GEO sets.<br>
