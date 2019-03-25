import { ADD_MAKE, ADD_MODEL, FETCH_VEHICLES } from '../actions/types'

const initialState = {
    make: [],
    model: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_VEHICLES:

            const fetchedVehicles = action.payload.vehicle;
            const newVehicleList = [];
            let newVehicle = {};

            for (let i = 1; i < fetchedVehicles.length + 1; i++) {
                const vehicle = fetchedVehicles[i - 1];

                if (i % 2 === 1) {
                    newVehicle.id = vehicle.vehicle_id;
                    newVehicle.fromCity = vehicle.registration;
                    newVehicle.fromStreet = vehicle.make;
                    newVehicle.date = vehicle.model;
                    newVehicle.time = vehicle.year;
                    newVehicle.startTime = vehicle.passenger_seats;
                    newVehicle.endTime = vehicle.wheelchair_spaces;
                    newVehicle.expired = vehicle.currently_driven;
                    newVehicle.paid = vehicle.paid;
                    continue;
                }
            }

            return {
                ...state,
                vehicles: newVehicleList,
                vehiclesLength: newVehicleList.length + 1
            }

        case ADD_MAKE:

            return {
                ...state,
                make: [...state.make, action.payload],
            }

        case ADD_MODEL:

            return {
                ...state,
                model: [...state.model, action.payload],
            }

        default:
            return state;
    }
}