const express = require('express');
const path = require('path');
const gonebusy = require('gonebusy-nodejs-client');
const url = require('url');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = express.Router();

/* Loads variables from .env */
dotenv.load();
const { API_KEY, SERVICE_ID, USER_ID, PORT } = process.env;

gonebusy.Configuration.currentEnvironment = 'sandbox';
const authorization = `Token ${API_KEY}`;
const { ServicesController, ResourcesController, BookingsController } = gonebusy;

const app = express();
app.use(bodyParser.json());
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '/public');
    app.use(express.static(staticPath));
}

router.get('/service', (req, res) => {
    ServicesController.getServiceById(authorization, SERVICE_ID).then((success) =>
        res.send(success.service)
    ).catch((error) =>
        console.log(error.errorMessage)
    );
});

router.get('/resources/:id', (req, res) => {
    const { id } = req.params;
    ResourcesController.getResourceById(authorization, id).then((success) =>
        res.send(success.resource)
    ).catch((error) =>
        console.log(error.errorMessage)
    );
});

router.get('/slots', (req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const resourceId = query.resourceId;
    ServicesController.getServiceAvailableSlotsById(authorization, SERVICE_ID, null, startDate, endDate, resourceId)
        .then((success) =>
            res.send(success.service.resources)
        )
        .catch((error) =>
            console.log(error.errorMessage)
        );
});

router.post('/bookings/new', (req, res) => {
    const { date, time, duration, resourceId} = req.body;
    const createBookingBody = {
        date,
        time,
        duration,
        resource_id: resourceId,
        service_id: SERVICE_ID,
        user_id: USER_ID
    };
    BookingsController.createBooking(authorization, createBookingBody).then((success) =>
        res.send(success)
    ).catch((error) =>
        console.log(error.errorMessage)
    );
});

router.get('/bookings/:userId', (req, res) => {
   const { userId } = req.params;
   BookingsController.getBookings(authorization, userId).then((success) => {
       res.send(success.bookings)
   }).catch((error) => {
       console.log(error.errorMessage, ' errors retrieving booking');
   })
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
