import {
	FETCH_TICKETS,
	CANCEL_TICKET,
	AMEND_TICKET,
	ADD_TICKET,
	FAVOURITE_TICKET,
	REMOVE_FAVOURITE_TICKET
} from './types';
import ip from '../../server/keys/ipstore';
import { getRequestAuthorized } from '../../API';

export function cancelTicket(ticketId) {
	return {
		type: CANCEL_TICKET,
		payload: ticketId
	};
}

export function amendTicket(ticketId) {
	return {
		type: AMEND_TICKET,
		payload: ticketId
	};
}

export function favouriteTicket(ticketId) {
	return {
		type: FAVOURITE_TICKET,
		payload: ticketId
	};
}

export function removeFavouriteTicket(ticketId) {
	return {
		type: REMOVE_FAVOURITE_TICKET,
		payload: ticketId
	};
}

export function addTicket(ticket) {
	return {
		type: ADD_TICKET,
		payload: ticket
	};
}

export function fetchTickets() {
	return function(dispatch) {
		getRequestAuthorized(`http://${ip}:3000/user/tickets`).then((response) => {
			console.log(response)
			dispatch({
				type: FETCH_TICKETS,
				payload: response
			});
		});
	};
}
