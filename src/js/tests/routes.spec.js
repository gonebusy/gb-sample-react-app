import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { Route, IndexRoute } from 'react-router';
import { spy, stub } from 'sinon';
import { findAll, findAllWithType } from 'react-shallow-testutils';
import * as staffActions from 'src/js/actions/staff';
import { CLEAR_SELECTED_STAFF_MEMBER, DATE_SELECTED } from 'src/js/action-types';
import moment from 'moment';
import { POP } from 'src/js/constants';
import noop from '../../../lib/util/noop';
import Routes from '../routes';
import BookingConfirmation from '../components/booking-confirmation';
import Nav from '../components/nav';
import StaffPicker from '../components/staff-picker';
import StaffCalendar from '../components/staff-calendar';
import StaffSlots from '../components/staff-slots';
import StaffForm from '../components/staff-form';
import Slide from '../components/slide-route-transition';

describe('<Routes>', () => {
    context('when it renders', () => {
        let component;
        before(() => {
            component = renderShallow(<Routes dispatch={noop} getState={noop} />).output;
        });

        it('renders the Nav component and StaffPicker routes', () => {
            expect(component).to.include(
              <Route path="/" component={Nav}>
                <IndexRoute component={StaffPicker} onEnter={noop} />
                <Route
                    path="staff/:id"
                    onEnter={noop}
                    component={Slide}
                >
                  <IndexRoute component={StaffCalendar} />
                  <Route path="available_slots/:date/start" component={StaffSlots} onEnter={noop} />
                  <Route path="available_slots/:date/end" component={StaffSlots} />
                  <Route path="book" component={StaffForm} />
                </Route>
                <Route path="confirm" component={Slide}>
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
            const component = renderShallow(<Routes dispatch={dispatch} getState={noop} />).output;
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

    context('on entering root', () => {
        const dispatch = spy();
        before(() => {
            const component = renderShallow(<Routes dispatch={dispatch} getState={noop} />).output;
            const rootRoute = findAllWithType(
                component, IndexRoute)[0];
            rootRoute.props.onEnter();
        });
        it(`dispatches ${CLEAR_SELECTED_STAFF_MEMBER}`, () => {
            expect(dispatch).to.have.been.calledWith({
                type: CLEAR_SELECTED_STAFF_MEMBER
            });
        });
    });

    context(
        'on entering staff/:id/available_slots/:date/start from pressing the back button',
        () => {
            const selectedDate = moment.utc();
            const dispatch = spy();
            const getState = () => ({
                staff: {
                    selectedStaffMember: {
                        selectedDate
                    }
                }
            });
            before(() => {
                const component = renderShallow(
                  <Routes dispatch={dispatch} getState={getState} />
                ).output;
                const startRoute = findAll(
                    component, element => element.props.path === 'available_slots/:date/start')[0];
                const nextState = { location: { action: POP } };
                startRoute.props.onEnter(nextState);
            });

            it(`dispatches ${DATE_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: DATE_SELECTED,
                    date: selectedDate
                });
            });
        });
});
