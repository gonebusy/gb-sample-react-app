import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { fetchStaff, selectDate, selectStaff } from 'src/js/actions/staff';
import request from 'superagent-bluebird-promise';
import { DATE_SELECTED, STAFF_SELECTED, STAFF_FETCHED } from 'src/js/action-types';
import store from 'src/js/store';
import moment from 'moment';

describe('staff action creators', () => {
    describe('selectStaff', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const startDate = '2017-03-01';
            const endDate = '2017-03-31';
            const staffMember = {
                id: 4,
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
                        id: 4
                    }
                ]
            };

            const slotsEndpoint = `/slots?startDate=${startDate}&endDate=${endDate}`;

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

            it(`calls GET with ${slotsEndpoint}`, () => {
                expect(request.get).to.have.been.calledWith(
                    slotsEndpoint
                );
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: STAFF_SELECTED,
                    staffMember,
                    availableSlots: {
                        '2017-03-30': ['6:00 PM', '6:30 PM']
                    }
                });
            });
        });
    });
    describe('fetchStaff', () => {
        context('when invoked', () => {
            const service = {
                body: [1]
            };
            const resource = {
                body: {
                    id: 1,
                    name: 'James Hunter'
                }
            };
            const staffMembers = [
                { id: 1, name: 'James Hunter', imagePath: 'http://i.pravatar.cc/300?img=69' }
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
});
