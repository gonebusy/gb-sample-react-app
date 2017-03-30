const express = require('express');
const path = require('path');
const gonebusy = require('gonebusy-nodejs-client');
const Promise = require('bluebird').Promise;
const url = require('url');

gonebusy.configuration.BASEURI = 'https://sandbox.gonebusy.com/api/v1';
const authorization = 'Token ad86866858ea7c256390f96f58c520df';
const serviceId = 2010395226;

const services = Promise.promisifyAll(gonebusy.ServicesController);
const resources = Promise.promisifyAll(gonebusy.ResourcesController);


const app = express();

if (process.env.NODE_ENV === 'production') {
    var staticPath = path.join(__dirname, '/public');
    app.use(express.static(staticPath));
}

app.get('/service', (req, res) => {
    services.getServiceById({id: serviceId, authorization}, (error, success) => {
        if(error) {
           console.log(error.errorMessage);
        } else {
            res.send(success.service.resources);
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

app.listen(4000, () => {
	console.log('listening on port 4000');
});
