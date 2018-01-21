import { expect } from 'chai';
import { spy, stub } from 'sinon';
import {
    fetchStaff, fetchSlotsForResource,
    selectDate, fetchBookings
} from 'src/js/actions/staff';
import request from 'superagent-bluebird-promise';
import {
    DATE_SELECTED, BOOKINGS_FETCHED,
    SLOTS_FETCHED, STAFF_FETCHED,
    IS_LOADING
} from 'src/js/action-types';
import store from 'src/js/store';
import moment from 'moment';
import * as urls from 'src/js/urls';
import { fromMilitaryTime } from 'src/js/utils/time';
import uuidv1 from 'uuid/v1';

describe('staff action creators', () => {
    describe('fetchStaff', () => {
        context('when invoked', () => {
            const duration = 60;
            const maxDuration = 90;
            const resourceId = uuidv1();
            const service = {
                body: {
                    resources: [resourceId], // resourceId returned from the service
                    duration,
                    max_duration: maxDuration
                }
            };
            const resource = {
                body: {
                    id: resourceId, // resourceId returned from resources
                    name: 'James Hunter'
                }
            };
            const staffMembers = [
                {
                    id: resourceId,
                    name: 'James Hunter',
                    imagePath: 'http://i.pravatar.cc/300?img=69'
                }
            ];
            const serviceEndpoint = '/api/service';
            const resourcesEndpoint = `/api/resources/${staffMembers[0].id}`;

            before((done) => {
                stub(request, 'get')
                    .withArgs(serviceEndpoint)
                    .returns(Promise.resolve(service))
                    .withArgs(resourcesEndpoint)
                    .returns(Promise.resolve(resource));
                stub(store, 'dispatch');
                setTimeout(() => {
                    fetchStaff()(store.dispatch);
                    done();
                });
            });

            after(() => {
                request.get.restore();
                store.dispatch.restore();
            });

            it(`calls GET with ${serviceEndpoint}`, () => {
                expect(request.get).to.have.been.calledWith(
                    serviceEndpoint
                );
            });

            it(`calls GET with ${resourcesEndpoint}`, () => {
                expect(request.get).to.have.been.calledWith(
                    resourcesEndpoint
                );
            });

            it(`dispatches with ${STAFF_FETCHED}`, () => {
                expect(store.dispatch).to.have.been.calledWith({
                    type: STAFF_FETCHED,
                    staffMembers,
                    duration,
                    maxDuration
                });
            });
        });
    });
    describe('selectDate', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const selectedDate = moment.utc();
            before(() => {
                selectDate(selectedDate)(dispatch);
            });

            it(`dispatches with ${DATE_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: DATE_SELECTED,
                    date: selectedDate
                });
            });
        });
    });

    describe('fetchSlotsForResource', () => {
        const startFormatted = '2017-03-01';
        const startDate = moment.utc(startFormatted);
        const endFormatted = '2017-03-31';
        const resourceId = uuidv1();
        const year = startDate.year();
        const month = startDate.month();
        const slots = ['6:00 PM', '6:30 PM'];
        const availableSlots = {
            body: [
                {
                    available_slots: [
                        {
                            date: startFormatted,
                            slots: ['2017-03-01T18:00:00Z', '2017-03-01T18:30:00Z']
                        }
                    ],
                    id: resourceId // resourceId from availableSlots
                }
            ]
        };

        const allAvailableSlots = {
            [resourceId]: { // resourceId
                [year]: {
                    [month]: { // month index
                        [startFormatted]: slots
                    }
                }
            }
        };
        const slotsUrl = (start, end, id) => (
            `/api/slots?startDate=${start}&endDate=${end}&resourceId=${id}`
        );
        context('when invoked and slots for that month and year have not been fetched', () => {
            const dispatch = spy();

            before((done) => {
                stub(request, 'get').returns(Promise.resolve(availableSlots));
                const getState = () => ({
                    staff: {
                        allAvailableSlots: {}
                    }
                });
                setTimeout(() => {
                    fetchSlotsForResource(startDate, resourceId)(dispatch, getState);
                    done();
                });
            });

            after(() => {
                request.get.restore();
            });

            it(`calls GET with ${slotsUrl}`, () => {
                expect(request.get).to.have.been.calledWith(
                    urls.slots(startFormatted, endFormatted, resourceId)
                );
            });

            it(`dispatches with ${SLOTS_FETCHED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: SLOTS_FETCHED,
                    id: resourceId,
                    month,
                    year,
                    availableSlots: {
                        [startFormatted]: slots
                    },
                    dayPickerMonth: startDate.toDate(),
                    fetchedDate: startDate,
                    loading: false
                });
            });
        });

        context('when invoked and slots for that year and month have been fetched', () => {
            const dispatch = spy();

            before((done) => {
                stub(request, 'get').returns(Promise.resolve(availableSlots));
                const getState = () => ({
                    staff: {
                        allAvailableSlots
                    }
                });
                setTimeout(() => {
                    fetchSlotsForResource(startDate, resourceId)(dispatch, getState);
                    done();
                });
            });

            after(() => {
                request.get.restore();
            });

            it(`does not call GET with ${slotsUrl}`, () => {
                expect(request.get).to.not.have.been.called();
            });

            it(`dispatches with ${IS_LOADING} with true`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: IS_LOADING,
                    loading: true
                });
            });

            it(`dispatches with ${SLOTS_FETCHED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: SLOTS_FETCHED,
                    id: resourceId,
                    month,
                    year,
                    availableSlots: {
                        [startFormatted]: slots
                    },
                    dayPickerMonth: startDate.toDate(),
                    fetchedDate: startDate,
                    loading: false
                });
            });
        });
    });

    describe('fetchBookings', () => {
        context('when it is invoked', () => {
            const dispatch = spy();
            const firstResourceId = uuidv1();
            const secondResourceId = uuidv1();
            const firstStartDate = '2017-07-13';
            const secondStartDate = '2017-07-14';
            const firstStartTime = '11:00';
            const secondStartTime = '21:00';
            const firstEndTime = '12:00';
            const secondEndTime = '22:00';
            const bookings = [
                {
                    resource_id: firstResourceId,
                    time_window: {
                        start_date: firstStartDate,
                        start_time: firstStartTime,
                        end_time: firstEndTime
                    }
                },
                {
                    resource_id: secondResourceId,
                    time_window: {
                        start_date: secondStartDate,
                        start_time: secondStartTime,
                        end_time: secondEndTime
                    }
                }
            ];
            const bookingsByResource = {
                [firstResourceId]: {
                    [firstStartDate]: [{
                        startTime: fromMilitaryTime(firstStartTime),
                        endTime: fromMilitaryTime(firstEndTime)
                    }]
                },
                [secondResourceId]: {
                    [secondStartDate]: [{
                        startTime: fromMilitaryTime(secondStartTime),
                        endTime: fromMilitaryTime(secondEndTime)
                    }]
                }
            };
            before(() => {
                stub(request, 'get').returns(Promise.resolve({ body: bookings }));
                return fetchBookings()(dispatch);
            });

            after(() => {
                request.get.restore();
            });

            it('calls GET with /api/bookings', () => {
                expect(request.get).to.have.been.calledWith('/api/bookings');
            });

            it(`dispatches with ${BOOKINGS_FETCHED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: BOOKINGS_FETCHED,
                    bookingsByResource
                });
            });
        });
    });
});
