const express = require('express');
const path = require('path');
const gonebusy = require('gonebusy-nodejs-client');
const Promise = require('bluebird').Promise;
const url = require('url');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = express.Router();

/* Loads variables from .env */
dotenv.load();
const { API_KEY, SERVICE_ID, USER_ID, PORT } = process.env;

gonebusy.Configuration.currentEnvironment = 'sandbox';
const authorization = `Token ${API_KEY}`;
const serviceId = SERVICE_ID;
const userId = USER_ID;
const { ServicesController, ResourcesController, BookingsController } = gonebusy;

const app = express();
app.use(bodyParser.json());
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '/public');
    app.use(express.static(staticPath));
}

router.get('/service', (req, res) => {
    ServicesController.getServiceById(authorization, serviceId).then((success) =>
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
    ServicesController.getServiceAvailableSlotsById(authorization, serviceId, null, endDate, null, startDate)
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
        service_id: serviceId,
        user_id: userId
    };
    BookingsController.createBooking(authorization, createBookingBody).then((success) =>
        res.send(success)
    ).catch((error) =>
        console.log(error.errorMessage)
    );
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
