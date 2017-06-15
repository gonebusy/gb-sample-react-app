import { expect } from 'chai';
import { stub } from 'sinon';
import React from 'react';
import { STAFF_FETCHED, BOOKINGS_FETCHED } from 'src/js/action-types';
import renderShallow from 'render-shallow';
import store from 'src/js/store';
import App from '../components/app';

describe('<App>', () => {
    context('when component mounts', () => {

        before((done) => {
            stub(store, 'dispatch');
            setTimeout(() => {
                const { instance } = renderShallow(<App />);
                instance().componentWillMount();
                done();
            });
        });

        after(() => {
            store.dispatch.restore();
        });

        it(`dispatches with ${STAFF_FETCHED}`, () => {
            expect(store.dispatch).to.have.been.called();
        });

        it(`dispatches with ${BOOKINGS_FETCHED}`, () => {
            expect(store.dispatch).to.have.been.called();
        });
    });
});
