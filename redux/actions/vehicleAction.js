import { ADD_VEHICLE, REMOVE_VEHICLE, FETCH_VEHICLES } from './types'
import ip from '../../ipstore'

export function addVehicle(vehicle) {
    return {
        type: ADD_VEHICLE,
        payload: vehicle
    }
}

export function removeVehicle(vehicleIndex) {
    return {
        type: REMOVE_VEHICLE,
        payload: vehicleIndex
    }
}

export function fetchVehicles() {
    return function (dispatch) {
        fetch(`http://${ip}:3000/driver/vehicles/getVehicles`)
            .then((response) => response.json())
            .then((response) => {
                dispatch({
                    type: FETCH_VEHICLES,
                    payload: response
                })
            });
    }
}