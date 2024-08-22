import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/eventSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { Link } from "react-router-dom";
import './EventList.css';

const EventList = () => {
    const dispatch = useDispatch<AppDispatch>(); // Use the correct dispatch type
    const { events, loading, error } = useSelector((state: RootState) => state.events);
    const [sortCriteria, setSortCriteria] = useState<'name' | 'date'>('name');
    const [filterByDate, setFilterByDate] = useState<string>('');
    const [filterByTickets, setFilterByTickets] = useState<number | ''>('');

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const sortedEvents = [...events].sort((a, b) => {
        if (sortCriteria === 'name') {
            return a.name.localeCompare(b.name);
        } else {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
    });

    const filteredEvents = sortedEvents.filter(event => {
        const eventDateMatches = filterByDate
            ? new Date(event.date).toISOString().slice(0, 10) === filterByDate
            : true;

        const ticketsAvailableMatches = filterByTickets
            ? event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0) >= filterByTickets
            : true;

        return eventDateMatches && ticketsAvailableMatches;
    });

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error loading events: {error}</p>;

    return (
        <div className='event-list'>
            <div className="controls">
                <div className="sort">
                    <label>
                        Sort by:
                        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value as 'name' | 'date')}>
                            <option value="name">Name</option>
                            <option value="date">Date</option>
                        </select>
                    </label>
                </div>
                <div className="filter">
                    <label>
                        Filter by date:
                        <input
                            type="date"
                            value={filterByDate}
                            onChange={(e) => setFilterByDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Filter by tickets available (minimum):
                        <input
                            type="number"
                            value={filterByTickets}
                            onChange={(e) => setFilterByTickets(e.target.value ? parseInt(e.target.value) : '')}
                        />
                    </label>
                </div>
            </div>
            {filteredEvents.length === 0 ? (
                <div className="no-events">
                    <p>There are no events that match your criteria, maybe, <Link to='/create'>create one?</Link></p>
                </div>
            ) : (
                <>
                    <Link className="create-link" to='/create'>Create a new event</Link>
                    {filteredEvents.map((event) => (
                        <div key={event.id} className='event'>
                            <h2>{event.name}</h2>
                            <p>{dateFormatter.format(new Date(event.date))}</p>
                            <Link to={`/event/${event.id}`}>View</Link>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default EventList;
