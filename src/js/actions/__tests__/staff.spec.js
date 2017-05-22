import { expect } from 'chai';
import { spy, stub } from 'sinon';
import {
    fetchStaff, fetchSlotsForResource,
    selectDate
} from 'src/js/actions/staff';
import request from 'superagent-bluebird-promise';
import {
    DATE_SELECTED,
    SLOTS_FETCHED, STAFF_FETCHED
} from 'src/js/action-types';
import store from 'src/js/store';
import moment from 'moment';
import * as urls from 'src/js/urls';

describe('staff action creators', () => {
    describe('fetchStaff', () => {
        context('when invoked', () => {
            const duration = 60;
            const service = {
                body: {
                    resources: [100001], // resourceId returned from the service
                    duration
                }
            };
            const resource = {
                body: {
                    id: 100001, // resourceId returned from resources
                    name: 'James Hunter'
                }
            };
            const staffMembers = [
                { id: 100001, name: 'James Hunter', imagePath: 'http://i.pravatar.cc/300?img=69' }
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
                    duration
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
        const resourceId = 100004;
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
                2: { // month index
                    [startFormatted]: slots
                }
            }
        };
        const slotsUrl = (start, end, id) => (
            `/api/slots?startDate=${start}&endDate=${end}&resourceId=${id}`
        );
        context('when invoked and slots for that month have not been already fetched', () => {
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
                    month: startDate.month(),
                    availableSlots: {
                        [startFormatted]: slots
                    }
                });
            });
        });

        context('when invoked and slots for that month have been fetched already', () => {
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

            it(`dispatches with ${SLOTS_FETCHED}`, () => {
                expect(dispatch).to.not.have.been.called();
            });
        });
    });
});
