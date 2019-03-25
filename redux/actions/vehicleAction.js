import { ADD_MAKE, ADD_MODEL, ADD_VEHICLE, FETCH_VEHICLES} from './types'
import ip from '../../ipstore'

export function addMake(data) {
    return {
        type: ADD_MAKE,
        payload: data
    }
}

export function addModel(data) {
    return {
        type: ADD_MODEL,
        payload: data
    }
}

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