const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb+srv://ustinovoleksij:YVKOeZrizTjRFiWq@cluster0.9v9un.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.error('Could not connect to MongoDB...', err)
})

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: String,
    tickets: [
        {
            type: String,
            quantity: Number,
            price: Number
        }
    ]
})

const Event = mongoose.model('Event', eventSchema)

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events.map(event => ({
            id: event._id,
            name: event.name,
            description: event.description,
            date: event.date,
            tickets: event.tickets
        })))
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (event == null) {
            return res.status(404).json({ message: 'Cannot find event' })
        }
        res.json({
            id: event._id,
            name: event.name,
            description: event.description,
            date: event.date,
            tickets: event.tickets
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.post('/events', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        tickets: req.body.tickets
    })
    try {
        const newEvent = await event.save()
        res.status(201).json({
            id: newEvent._id,
            name: newEvent.name,
            description: newEvent.description,
            date: newEvent.date,
            tickets: newEvent.tickets
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

app.put('/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json({
            id: updatedEvent._id,
            name: updatedEvent.name,
            description: updatedEvent.description,
            date: updatedEvent.date,
            tickets: updatedEvent.tickets
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

app.delete('/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
