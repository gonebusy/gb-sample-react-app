import { expect } from 'chai';
import { stub } from 'sinon';
import React from 'react';
import { STAFF_FETCHED } from 'src/js/action-types';
import request from 'superagent-bluebird-promise';
import renderShallow from 'render-shallow';
import store from 'src/js/store';
import App from '../components/app';

describe('<App>', () => {
    context('when component mounts', () => {
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

        it(`dispatches with ${STAFF_FETCHED}`, () => {
            expect(store.dispatch).to.have.been.calledWith({
                type: STAFF_FETCHED,
                staffMembers
            });
        });
    });
});
