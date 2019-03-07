import { FETCH_TICKETS, REMOVE_TICKET} from '../actions/types'

const initialState = {
    tickets: []
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
                tickets: newTicketList
            }

        case REMOVE_TICKET:
            return {
                ...state          
            }
       
        default:
            return state;
    }
}