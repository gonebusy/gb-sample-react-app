import React, { PropTypes } from 'react';
import { browserHistory, Route, Router, IndexRoute } from 'react-router';
import {
    CLEAR_SELECTED_STAFF_MEMBER,
    DATE_SELECTED,
    STAFF_SELECTED
} from 'src/js/action-types';
import Nav from 'src/js/components/nav';
import StaffPicker from 'src/js/components/staff-picker';
import StaffCalendar from 'src/js/components/staff-calendar';
import StaffSlots from 'src/js/components/staff-slots';
import StaffForm from 'src/js/components/staff-form';
import BookingConfirmation from 'src/js/components/booking-confirmation';
import { fetchSlotsForResource } from 'src/js/actions/staff';
import { POP } from 'src/js/constants';
import moment from 'moment';
import Slide from 'src/js/components/slide-route-transition';
import { formatMonth } from 'src/js/utils/date';

const Routes = ({ dispatch, getState }) => (
  <Router history={browserHistory}>
    <Route path="/" component={Nav}>
      <IndexRoute
          component={StaffPicker} onEnter={
          () => {
              dispatch({
                  type: CLEAR_SELECTED_STAFF_MEMBER
              });
          }
      }
      />
      <Route
          path="staff/:id/available_slots/:year/:month"
          onEnter={
                  (nextState) => {
                      const { params: { id, year, month } } = nextState;
                      dispatch({ type: STAFF_SELECTED, id });
                      dispatch(
                          fetchSlotsForResource(
                              moment.utc(`${year}-${formatMonth(month)}-01`),
                              id
                          )
                      );
                  }
              }
          component={Slide}
      >
        <IndexRoute component={StaffCalendar} />
        <Route
            path=":day/start" component={StaffSlots} onEnter={
            (nextState) => {
                if (nextState.location.action === POP) {
                    const { selectedDate } = getState().staff.selectedStaffMember;
                    dispatch({ type: DATE_SELECTED, date: selectedDate });
                }
            }
        }
        />
        <Route
            path=":day/end" component={StaffSlots}
        />
        <Route path=":day/book" component={StaffForm} />
      </Route>
      <Route path="confirm" component={Slide}>
        <IndexRoute component={BookingConfirmation} />
      </Route>
    </Route>
  </Router>

);

Routes.propTypes = {
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
};

export default Routes;
