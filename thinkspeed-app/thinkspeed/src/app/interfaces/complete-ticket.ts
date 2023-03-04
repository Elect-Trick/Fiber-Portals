import { Ticket } from "./ticket";

export interface CompleteTicket {

  ticket_history: Ticket;
  location_string: string;
}
