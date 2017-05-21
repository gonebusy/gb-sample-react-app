import React from 'react';
import { browserHistory, Route, Router } from 'react-router';
import Nav from 'src/js/components/nav';
import StaffPicker from 'src/js/components/staff-picker';
import StaffCalendar from 'src/js/components/staff-calendar';
import StaffSlots from 'src/js/components/staff-slots';
import StaffForm from 'src/js/components/staff-form';
import BookingConfirmation from 'src/js/components/booking-confirmation';
import { MONTH_SELECTED, STAFF_SELECTED } from 'src/js/action-types';
import { fetchStaff, fetchSlots } from 'src/js/actions/staff';

const Routes = ({dispatch, getState}) => (
  <Router history={browserHistory}>
    <Route component={Nav}>
      <Route
          path="/"
          component={StaffPicker}
      />
          <Route
              path="staff/:id"
              component={StaffCalendar}
              onEnter={
                  (nextState) => {
                      const { params: {id } } = nextState;
                      dispatch({type: STAFF_SELECTED, id});
                  }
              }
          />
          <Route path="/available_slots" component={StaffSlots} />
          <Route path="/book" component={StaffForm} />
          <Route path="/confirm" component={BookingConfirmation} />
    </Route>
  </Router>

);

export default Routes;
