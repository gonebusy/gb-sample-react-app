import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { Route, IndexRoute } from 'react-router';
import { spy, stub } from 'sinon';
import { findAll } from 'react-shallow-testutils';
import * as staffActions from 'src/js/actions/staff';
import noop from '../../../lib/util/noop';
import Routes from '../routes';
import BookingConfirmation from '../components/booking-confirmation';
import Nav from '../components/nav';
import StaffPicker from '../components/staff-picker';
import StaffCalendar from '../components/staff-calendar';
import StaffSlots from '../components/staff-slots';
import StaffForm from '../components/staff-form';
import SlideLeft from '../components/slide-left-route-transition';

describe('<Routes>', () => {
    context('when it renders', () => {
        let component;
        before(() => {
            component = renderShallow(<Routes dispatch={noop} getState={noop} />).output;
        });

        it('renders the Nav component and StaffPicker routes', () => {
            expect(component).to.include(
              <Route path="/" component={Nav}>
                <IndexRoute component={StaffPicker} />
                <Route
                    path="staff/:id"
                    onEnter={noop}
                    component={SlideLeft}
                >
                  <IndexRoute component={StaffCalendar} />
                  <Route path="available_slots/:date/start" component={StaffSlots} />
                  <Route path="available_slots/:date/end" component={StaffSlots} />
                  <Route path="book" component={StaffForm} />
                </Route>
                <Route path="confirm" component={SlideLeft}>
                  <IndexRoute component={BookingConfirmation} />
                </Route>
              </Route>
            );
        });

    });

    context('on entering staff/:id', () => {
        const dispatch = spy();
        before(() => {
            stub(staffActions, 'fetchSlotsForResource').returns(Promise.resolve({}));
            const component = renderShallow(<Routes dispatch={dispatch} />).output;
            const staffIdRoute = findAll(
                component, element => element.props.path === 'staff/:id')[0];
            const nextState = { params: { id: '10004' } };
            staffIdRoute.props.onEnter(nextState);

        });

        after(() => {
            staffActions.fetchSlotsForResource.restore();
        });

        it('calls fetchSlotsForResource', () => {
            expect(staffActions.fetchSlotsForResource).to.have.been.called();
        });

        it('dispatches result of fetchSlotsForResource', () => {
            expect(dispatch).to.have.been.called();
        });

    });
});
