import { expect } from 'chai';
import { spy, stub } from 'sinon';
import {
    fetchStaff, fetchSlots,
    selectMonth, selectStaff,
    selectDate
} from 'src/js/actions/staff';
import request from 'superagent-bluebird-promise';
import {
    DATE_SELECTED, MONTH_SELECTED,
    SLOTS_FETCHED, STAFF_SELECTED, STAFF_FETCHED
} from 'src/js/action-types';
import store from 'src/js/store';
import moment from 'moment';

describe('staff action creators', () => {
    describe('selectStaff', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const startDate = '2017-03-01';
            const endDate = '2017-03-31';
            const staffMember = {
                id: 100004, // resourceId
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            };

            const availableSlots = {
                body: [
                    {
                        available_slots: [
                            {
                                date: '2017-03-30',
                                slots: '2017-03-30T18:00:00Z,2017-03-30T18:30:00Z'
                            }
                        ],
                        id: 100004 // resourceId
                    }
                ]
            };

            before((done) => {
                stub(request, 'get').returns(Promise.resolve(availableSlots));

                setTimeout(() => {
                    selectStaff(staffMember, startDate, endDate)(dispatch);
                    done();
                });
            });

            after(() => {
                request.get.restore();
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: STAFF_SELECTED,
                    staffMember
                });
            });
        });
    });
    describe('fetchStaff', () => {
        context('when invoked', () => {
            const service = {
                body: [100001] // resourceId returned from the service
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
            const serviceEndpoint = '/service';
            const resourcesEndpoint = `/resources/${staffMembers[0].id}`;

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
                    staffMembers
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

    describe('fetchSlots', () => {
        const startDateFormatted = '2017-03-01';
        const startDate = moment.utc(startDateFormatted);
        const endDateFormatted = '2017-03-31';

        const availableSlots = {
            body: [
                {
                    available_slots: [
                        {
                            date: '2017-03-30',
                            slots: '2017-03-30T18:00:00Z,2017-03-30T18:30:00Z'
                        }
                    ],
                    id: 100004 // resourceId from availableSlots
                },
                {
                    available_slots: [
                        {
                            date: '2017-03-31',
                            slots: '2017-03-31T12:00:00Z,2017-03-31T12:30:00Z'
                        }
                    ],
                    id: 100003 // resourceId from availableSlots
                }
            ]
        };

        const allAvailableSlots = {
            100004: { // resourceId
                2: { // month index
                    '2017-03-30': ['6:00 PM', '6:30 PM']
                }
            },
            100003: { // resourceId
                2: { // month index
                    '2017-03-31': ['12:00 PM', '12:30 PM']
                }
            }
        };
        const slotsEndpoint = `/slots?startDate=${startDateFormatted}&endDate=${endDateFormatted}`;
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
                    fetchSlots(startDate)(dispatch, getState);
                    done();
                });
            });

            after(() => {
                request.get.restore();
            });

            it(`calls GET with ${slotsEndpoint}`, () => {
                expect(request.get).to.have.been.calledWith(
                    slotsEndpoint
                );
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: SLOTS_FETCHED,
                    allAvailableSlots
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
                    fetchSlots(startDate)(dispatch, getState);
                    done();
                });
            });

            after(() => {
                request.get.restore();
            });

            it(`does not call GET with ${slotsEndpoint}`, () => {
                expect(request.get).to.not.have.been.called();
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.not.have.been.called();
            });
        });
    });

    describe('selectMonth', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const selectedMonth = moment.utc().month();
            before(() => {
                selectMonth(selectedMonth)(dispatch);
            });

            it(`dispatches with ${MONTH_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: MONTH_SELECTED,
                    month: selectedMonth
                });
            });
        });
    });
});
