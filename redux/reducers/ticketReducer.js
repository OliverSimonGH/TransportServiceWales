import { FETCH_TICKETS, CANCEL_TICKET, ADD_TICKET} from '../actions/types'
import update from 'immutability-helper';

const initialState = {
    tickets: [],
    ticketsLength: 0
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_TICKETS:

            const fetchedTickets = action.payload.ticket;
            const newTicketList = [];
            let newTicket = {};

            for (let i = 1; i < fetchedTickets.length + 1; i++) {
                const ticket = fetchedTickets[i - 1];
                
                if(i % 2 === 1){
                    newTicket.id = ticket.ticket_id;
                    newTicket.fromCity = ticket.city;
                    newTicket.fromStreet = ticket.street;
                    newTicket.startTime = ticket.start_time;
                    newTicket.endTime = ticket.end_time;
                    newTicket.expired = ticket.expired;
                    newTicket.paid = ticket.paid;
                    newTicket.used = ticket.used;
                    newTicket.cancelled = ticket.cancelled;
                    newTicket.completed = ticket.completed;
                    newTicket.favourited = ticket.favourited;
                    newTicket.accessibilityRequired = ticket.accessibility_required;
                    continue;
                }

                newTicket.toCity = ticket.city
                newTicket.toStreet = ticket.street

                newTicketList.push(newTicket)
                newTicket = {}
            }

            return {
                ...state,
                tickets: newTicketList,
                ticketsLength: newTicketList.length + 1
            }

        case CANCEL_TICKET:
        
            return {
                ...state,
                tickets: state.tickets.map(ticket => ticket.id === action.payload ? {...ticket, cancelled: 1, expired: 1} : ticket)  
            }
       
        case ADD_TICKET:

            console.log(state.ticketsLength)
            return {
                ...state,
                tickets: [...state.tickets, action.payload],
                ticketsLength: state.ticketsLength + 1
            }

        default:
            return state;
    }
}