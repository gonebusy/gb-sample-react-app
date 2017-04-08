const express = require('express');
const path = require('path');
const gonebusy = require('gonebusy-nodejs-client');
const Promise = require('bluebird').Promise;
const url = require('url');
const bodyParser = require('body-parser');

gonebusy.configuration.BASEURI = 'https://sandbox.gonebusy.com/api/v1';
const authorization = 'Token ad86866858ea7c256390f96f58c520df';
const serviceId = 2010395226;
const userId = 9309567258;

const services = Promise.promisifyAll(gonebusy.ServicesController);
const resources = Promise.promisifyAll(gonebusy.ResourcesController);
const bookings = Promise.promisifyAll(gonebusy.BookingsController);


const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '/public');
    app.use(express.static(staticPath));
}

app.get('/service', (req, res) => {
    services.getServiceById({id: serviceId, authorization}, (error, success) => {
        if(error) {
            console.log(error.errorMessage);
        } else {
            res.send(success.service);
        }
    });
});

app.get('/resources/:id', (req, res) => {
    const id = req.params.id;
    resources.getResourceById({id, authorization}, (error, success) => {
        if(error) {
            console.log(error.errorMessage);
        } else {
            res.send(success.resource);
        }
    })
});

app.get('/slots', (req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const startDate = query.startDate;
    const endDate = query.endDate;
    services.getServiceAvailableSlotsById({id: serviceId, startDate, endDate, authorization}, (error, success) => {
        if(error) {
            console.log(error.errorMessage);
        } else {
            res.send(success.service.resources)
        }
    });
});

app.post('/bookings/new', (req, res) => {
    const { date, time, duration, resourceId} = req.body;
    const createBookingBody = {
        date,
        time,
        duration,
        resource_id: resourceId,
        service_id: serviceId,
        user_id: userId
    };
    bookings.createBooking({authorization, createBookingBody}, (error, success) => {
        if(error) {
            console.log(error.errorMessage);
        } else {
            res.send(success);
        }
    });
});

app.listen(4000, () => {
    console.log('listening on port 4000');
});
