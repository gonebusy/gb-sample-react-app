const gonebusy = require('gonebusy-nodejs-client');
const request = require("request");
const Promise = require('bluebird').Promise;
const fs = require('fs');
const BASEURI = 'https://sandbox.gonebusy.com/api/v1';
gonebusy.configuration.BASEURI = BASEURI;

const services = Promise.promisifyAll(gonebusy.ServicesController);
const resources = Promise.promisifyAll(gonebusy.ResourcesController);
const schedules = Promise.promisifyAll(gonebusy.SchedulesController);

const AUTH_TOKEN = process.argv[2];
const TEAR_DOWN = process.argv[3];


const createResources = () => {
    const staffMembers = [
        { name: 'Phillip Fry', type: 'staff' },
        { name: 'Sarah Belmoris', type: 'staff' },
        { name: 'Selena Yamada', type: 'staff' },
        { name: 'James Hunter', type: 'staff' }
    ];

    const promises = [];
    staffMembers.forEach(staffMember => {
        const input = {
            authorization: AUTH_TOKEN,
            createResourceBody: staffMember
        };
        promises.push(new Promise((resolve, reject) => {
            resources.createResource(input, (error, success) => {
                if (error) {
                    console.log(`error in creating resource ${staffMember}: ${error.errorMessage}`);
                } else {
                    resolve(success.resource.id);
                }
            });
        }));
    });
    return promises;
};

const deleteResources = (resourceIds) => {
    resourceIds.forEach((resourceId) => {
        resources.deleteResourceById({id: resourceId, authorization: AUTH_TOKEN}, (error) => {
            if (error) {
                console.log(error.errorMessage);
                console.log(`Error in deleting resource: ${resourceId}`);
            }
        });
    });
};

const createService = (resourceIds) => {
    const createServiceBody = {
        name: 'LSAT Tutoring',
        description: 'LSAT Tutoring service',
        duration: 60,
        resources: resourceIds.join(',')
    };
    const input = {
        createServiceBody,
        authorization: AUTH_TOKEN
    };
    return new Promise((resolve, reject) => {
        services.createService(input, (error, success) => {
            if (error) {
                console.log(`error in creating service: ${error.errorMessage}`);
                reject();
            } else {
                const { id, ownerId, schedules } = success.service;
                console.log(`service id: ${id}`);
                console.log(`user id: ${ownerId}`);
                resolve({scheduleIds: schedules, userId: ownerId, serviceId: id});
            }
        });
    });
};

const deleteService = (serviceId) => {
    services.deleteServiceById({id: serviceId, authorization: AUTH_TOKEN}, (error) => {
        if(error) {
            console.log(error.errorMessage);
            console.log(`error in deleting service: ${serviceId}`);
       }
    });
};

const createSchedules = (scheduleIds) => {
    const resourceSchedules = [
        {
            start_date: '2017-03-26',
            start_time: '18:00',
            end_time: '21:00',
            days: 'monday,tuesday',
            recurs_by: 'weekly'
        },
        {
            start_date: '2017-03-26',
            start_time: '20:00',
            end_time: '21:00',
            days: 'wednesday,friday',
            recurs_by: 'weekly'
        },
        {
            start_date: '2017-03-26',
            start_time: '16:00',
            end_time: '21:00',
            days: 'friday',
            recurs_by: 'weekly'
        },
        {
            start_date: '2017-03-26',
            start_time: '18:00',
            end_time: '21:00',
            days: 'thursday',
            recurs_by: 'weekly'
        }
    ];
    const promises = [];
    for (let i = 0; i < scheduleIds.length; i++) {
        const input = {
            id: scheduleIds[i],
            createScheduleTimeWindowBody: resourceSchedules[i],
            authorization: AUTH_TOKEN
        };
        promises.push(new Promise((resolve, reject) => {
            schedules.createScheduleTimeWindow(input, (error) => {
                if (error) {
                    console.log(error.errorMessage);
                    console.log(`error in creating schedule for ${scheduleIds[i]}`);
                    reject();
                } else {
                    resolve();
                }
            });
        }));
    }
    return promises;
};

const deleteSchedules = (scheduleIds) => {
    scheduleIds.forEach(scheduleId => {
        schedules.deleteScheduleById({id: scheduleId, authorization: AUTH_TOKEN}, (error) => {
           if (error) {
               console.log(error.errorMessage);
               console.log(`error in deleting schedule: ${scheduleId}`);
           }
        });
    });
};

if (!AUTH_TOKEN) {
    console.log('please provide your API token');
    return;
}

if (TEAR_DOWN === 'teardown') {
    services.getServices({authorization: AUTH_TOKEN}, (error, success) => {
        if (error) {
            console.log('error in retrieving services');
        } else {
            const services = success.services;
            console.log(success);
            services.forEach(({ resources, schedules, id}) => {
                console.log(`deleting service: ${id}`);
                console.log(`deleting schedules: ${schedules} for service ${id}`);
                deleteSchedules(schedules);
                console.log(`deleting resources: ${resources} for service ${id}`);
                deleteResources(resources);
                deleteService(id);
                console.log(`deleted service: ${id}`)
            });
        }
    });
    return;
}


console.log('creating resources...');
const resourcePromises = createResources();
Promise.all(resourcePromises).then((resourceIds) => {
    if (resourceIds.length) {
        console.log('creating your service');
        const serviceResponse = createService(resourceIds);
        serviceResponse.then(({scheduleIds, userId, serviceId}) => {
            if (scheduleIds.length) {
                console.log('creating schedules');
                const schedulesPromises = createSchedules(scheduleIds);
                Promise.all(schedulesPromises).then(() => {
                    console.log('writing .env file');
                    fs.writeFile(
                    '.env',
                    `BASEURI=${BASEURI}\nAPI_KEY=${AUTH_TOKEN}\nSERVICE_ID=${serviceId}\nUSER_ID=${userId}\nPORT=4000`,
                    (error) => {
                        if (error) {
                            console.log('failed to write to .env file');
                        }
                        console.log('success');
                    });
                })
            }
        });
    }
});
