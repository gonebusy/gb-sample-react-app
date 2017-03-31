import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { fetchStaff, selectStaff } from 'src/js/actions/staff';
import request from 'superagent-bluebird-promise';
import { STAFF_SELECTED, STAFF_FETCHED } from 'src/js/action-types';
import store from 'src/js/store';

describe('staff action creators', () => {
    describe('selectStaff', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const staffMember = {
                id: 4,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            };

            before(() => {
                selectStaff(staffMember)(dispatch);
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: STAFF_SELECTED,
                    staffMember,
                    availableSlots: {
                        '2017-04-01': ['7:00', '8:00']
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
});
