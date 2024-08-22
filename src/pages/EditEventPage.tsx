import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import EventForm from "../components/EventForm/EventForm.tsx";


const EditEventPage = () => {
    const {id} = useParams<{ id: string }>();
    const event = useSelector((state: RootState) => state.events.events.find((event: {
        id: string
    }) => event.id === id));

    return (
        <div>
            {event ? <EventForm existingEvent={event}/> : <p>Event not found</p>}
        </div>
    );
};

export default EditEventPage;
