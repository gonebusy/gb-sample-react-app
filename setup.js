const gonebusy = require('gonebusy-nodejs-client');
const request = require("request");
const Promise = require('bluebird').Promise;
const fs = require('fs');
gonebusy.Configuration.currentEnvironment = 'sandbox';

const { ServicesController, ResourcesController, SchedulesController } = gonebusy;

const AUTH_TOKEN = process.argv[2];
const TEAR_DOWN = process.argv[3];
const authorization = `Token ${AUTH_TOKEN}`;


const createResources = () => {
    const staffMembers = [
        { name: 'Phillip Fry', type: 'staff' },
        { name: 'Sarah Belmoris', type: 'staff' },
        { name: 'Selena Yamada', type: 'staff' },
        { name: 'James Hunter', type: 'staff' }
    ];

    const promises = [];
    staffMembers.forEach(staffMember => {
        promises.push(new Promise((resolve, reject) => {
            ResourcesController.createResource(authorization, staffMember).then((success) => {
                resolve(success.resource.id);
            }).catch((error) => {
                console.log(`error in creating resource ${staffMember}: ${error.errorMessage}`);
                reject();
            });
        }));
    });
    return promises;
};

const deleteResources = (resourceIds) => {
    resourceIds.forEach((resourceId) => {
        ResourcesController.deleteResourceById(authorization, resourceId).catch((error) => {
                console.log(error.errorMessage);
                console.log(`Error in deleting resource: ${resourceId}`);
        });
    });
};

const createService = (resourceIds) => {
    const createServiceBody = {
        name: 'LSAT Tutoring',
        description: 'LSAT Tutoring service',
        duration: 60,
        max_duration: 90,
        resources: resourceIds.join(',')
    };
    return new Promise((resolve, reject) => {
        ServicesController.createService(authorization, createServiceBody).then((success) => {
            const { id, ownerId, schedules } = success.service;
            console.log(`service id: ${id}`);
            console.log(`user id: ${ownerId}`);
            resolve({scheduleIds: schedules, userId: ownerId, serviceId: id});
        }).catch((error) => {
            console.log(`error in creating service: ${error.errorMessage}`);
            reject();
        });
    });
};

const deleteService = (serviceId) => {
    ServicesController.deleteServiceById(authorization,serviceId).catch((error) => {
        console.log(error.errorMessage);
        console.log(`error in deleting service: ${serviceId}`);
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
        const id = scheduleIds[i];
        const createScheduleTimeWindowBody = resourceSchedules[i];
        promises.push(new Promise((resolve, reject) => {
            SchedulesController.createScheduleTimeWindow(authorization, id, createScheduleTimeWindowBody)
                .then((success) => (resolve()))
                .catch((error) => {
                    console.log(error.errorMessage);
                    console.log(`error in creating schedule for ${scheduleIds[i]}`);
                    reject();
                });
        }));
    }
    return promises;
};

const deleteSchedules = (scheduleIds) => {
    scheduleIds.forEach(scheduleId => {
        SchedulesController.deleteScheduleById(authorization, scheduleId).catch((error) => {
           console.log(error.errorMessage);
           console.log(`error in deleting schedule: ${scheduleId}`);
        });
    });
};

if (!AUTH_TOKEN) {
    console.log('please provide your API token');
    return;
}

if (TEAR_DOWN === 'teardown') {
    ServicesController.getServices(authorization).then((success) => {
        const services = success.services;
        services.forEach(({ resources, schedules, id}) => {
            console.log(`deleting service: ${id}`);
            console.log(`deleting schedules: ${schedules} for service ${id}`);
            deleteSchedules(schedules);
            console.log(`deleting resources: ${resources} for service ${id}`);
            deleteResources(resources);
            deleteService(id);
            console.log(`deleted service: ${id}`)
        });
    }).catch((error) => {
        console.log('error in retrieving services');
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
                    `API_KEY=${AUTH_TOKEN}\nSERVICE_ID=${serviceId}\nUSER_ID=${userId}\nPORT=4000`,
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
