import { FETCH_VEHICLES, ADD_VEHICLE } from '../actions/types'

const initialState = {
    vehicles: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_VEHICLES:
            var fetchedVehicles = action.payload;
            const newVehicleList = [];
            let newVehicle = {};

            fetchedVehicles.forEach(vehicle => {
                newVehicle.id = vehicle.vehicle_id;
                newVehicle.make = vehicle.make;
                newVehicle.model = vehicle.model;
                newVehicle.registration = vehicle.registration;
                newVehicle.numPassengers = vehicle.passenger_seats;
                newVehicle.numWheelchairs = vehicle.wheelchair_spaces;
                newVehicle.selectedVehicle = vehicle.currently_driven;
                newVehicle.vehicleType = vehicle.fk_vehicle_type_id;

                newVehicleList.push(newVehicle)
                newVehicle = {}
            });

            return {
                ...state,
                vehicles: newVehicleList,
            }

        case ADD_VEHICLE:
            return {
                ...state,
                vehicles: [...state.vehicles, action.payload],
            }

        default:
            return state;
    }
}