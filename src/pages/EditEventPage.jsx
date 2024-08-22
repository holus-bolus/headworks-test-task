import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EventForm from "../components/EventForm/EventForm";

const EditEventPage = () => {
    const { id } = useParams();
    const event = useSelector((state) => state.events.events.find((event) => event.id === id));

    return (
        <div>
            {event ? <EventForm existingEvent={event} /> : <p>Event not found</p>}
        </div>
    );
};

export default EditEventPage;