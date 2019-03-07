import { FETCH_TICKETS, REMOVE_TICKET } from './types'
import ip from '../../ipstore'

export function removeTicket(ticket){
    return {
        type: REMOVE_TICKET,
        payload: ticket
    }
}

export function fetchTickets() {
    return function(dispatch) {
        fetch(`http://${ip}:3000/user/tickets`)
		.then((response) => response.json())
		.then((response) => {
            dispatch({
                type: FETCH_TICKETS,
				payload: response
        })});
    }
}