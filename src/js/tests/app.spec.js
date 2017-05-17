import { expect } from 'chai';
import { stub } from 'sinon';
import React from 'react';
import { SLOTS_FETCHED, STAFF_FETCHED } from 'src/js/action-types';
import request from 'superagent-bluebird-promise';
import renderShallow from 'render-shallow';
import store from 'src/js/store';
import moment from 'moment';
import App from '../components/app';

describe('<App>', () => {
    context('when component mounts', () => {
        const duration = 60;
        const resourceId = 100001;
        const service = {
            body: {
                resources: [resourceId], // resourceId returned from the service
                duration
            }
        };
        const resource = {
            body: {
                id: resourceId,
                name: 'James Hunter'
            }
        };
        const staffMembers = [
            { id: resourceId, name: 'James Hunter', imagePath: 'http://i.pravatar.cc/300?img=69' }
        ];


        const startDate = moment.utc();
        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = startDate.endOf('month').format('YYYY-MM-DD');
        const serviceEndpoint = '/api/service';
        const resourcesEndpoint = `/api/resources/${staffMembers[0].id}`;
        const slotsUrl = `/api/slots?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        const availableSlots = {
            body: [
                {
                    available_slots: [
                        {
                            date: formattedStartDate,
                            slots: [`${formattedStartDate}T12:00:00Z`]
                        }
                    ],
                    id: resourceId
                }
            ]
        };
        const allAvailableSlots = {
            [resourceId]: {
                [startDate.month()]: {
                    [formattedStartDate]: ['12:00 PM']
                }
            }
        };
        before((done) => {
            stub(request, 'get')
                .withArgs(serviceEndpoint)
                .returns(Promise.resolve(service))
                .withArgs(resourcesEndpoint)
                .returns(Promise.resolve(resource))
                .withArgs(slotsUrl)
                .returns(Promise.resolve(availableSlots));
            stub(store, 'dispatch');
            stub(store, 'getState').returns({
                staff: {
                    allAvailableSlots: {}
                }
            });
            setTimeout(() => {
                const { instance } = renderShallow(<App />);
                instance().componentWillMount();
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

        it(`calls GET with ${slotsUrl}`, () => {
            expect(request.get).to.have.been.calledWith(
                slotsUrl
            );
        });

        it(`dispatches with ${STAFF_FETCHED}`, () => {
            expect(store.dispatch).to.have.been.calledWith({
                type: STAFF_FETCHED,
                staffMembers,
                duration
            });
        });

        it(`dispatches with ${SLOTS_FETCHED}`, () => {
            expect(store.dispatch).to.have.been.calledWith({
                type: SLOTS_FETCHED,
                allAvailableSlots
            });
        });
    });
});
