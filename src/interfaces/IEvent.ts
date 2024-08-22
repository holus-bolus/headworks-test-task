import ITicket from "./ITicket.ts";

interface IEvent{
    id:string;
    name:string;
    description:string;
    date:string;
    tickets:ITicket[];
}

export default IEvent;