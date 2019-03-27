import { ADD_VEHICLE, FETCH_VEHICLES } from './types'
import ip from '../../ipstore'

export function addVehicle(vehicle) {
    return {
        type: ADD_VEHICLE,
        payload: vehicle
    }
}

export function fetchVehicles() {
    return function (dispatch) {
        fetch(`http://${ip}:3000/user/vehicles`)
            .then((response) => response.json())
            .then((response) => {
                dispatch({
                    type: FETCH_VEHICLES,
                    payload: response
                })
            });
    }
}