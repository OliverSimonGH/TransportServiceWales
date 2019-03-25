import { FETCH_TICKETS, CANCEL_TICKET, ADD_TICKET} from './types'
import ip from '../../ipstore'
import { getRequestAuthorized } from '../../API'

export function cancelTicket(ticketId){
    return {
        type: CANCEL_TICKET,
        payload: ticketId
    }
}

export function addTicket(ticket){
    return {
        type: ADD_TICKET,
        payload: ticket
    }
}


export function fetchTickets() {
    return function(dispatch) {
        getRequestAuthorized(`http://${ip}:3000/user/tickets`)
		.then((response) => {
            dispatch({
                type: FETCH_TICKETS,
				payload: response
        })});
    }
}