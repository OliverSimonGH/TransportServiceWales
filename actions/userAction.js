import { ADD_USER, UPDATE_USER_FUNDS } from './types'

export function addUser(user){
    return {
        type: ADD_USER,
        payload: user
    }
}

export function updateUserFunds(amount){
    return {
        type: UPDATE_USER_FUNDS,
        payload: amount
    }
}
