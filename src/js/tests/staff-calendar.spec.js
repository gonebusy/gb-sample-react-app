import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import noop from 'lib/util/noop';
import { createNew } from 'src/js/store';
import { findWithType } from 'react-shallow-testutils';
import { DATE_SELECTED } from 'src/js/action-types';
import { initialState } from 'src/js/reducers/staff';
import Nav from '../components/nav';
import StaffCalendarConnected, { StaffCalendar } from '../components/staff-calendar';
import StaffSlots from '../components/staff-slots';
import CustomCalNavBar from '../components/custom-cal-nav-bar';


describe('<StaffCalendar>', () => {
    context('when rendered with props', () => {
        let component;
        const props = {
            navigationController: {},
            dispatch: noop,
            availableSlots: {
                '2017-03-31': [
                    '02:00 PM'
                ]
            },
            month: moment.utc()
        };

        // push every date before 3/31 to disabledDates
        const disabledDates = [];
        for (let i = 1; i < 31; i += 1)
            disabledDates.push(new Date(`2017-03-${i}`));


        before(() => {
            component = renderShallow(<StaffCalendar {...props} />).output;
        });

        it('renders a staff calendar', () => {
            expect(component).to.eql(
              <div className="staff-calendar">
                <Nav leftClick={() => noop()} />

                <div className="staff-calendar-picker">
                  <DayPicker
                      onDayClick={noop}
                      weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                      disabledDays={disabledDates}
                      navbarElement={
                        <CustomCalNavBar
                            dispatch={props.dispatch}
                            navigationController={props.navigationController}
                        />
                      }
                      month={props.month.toDate()}
                  />
                </div>
              </div>
            );
        });
    });

    context('when a calendar day is clicked', () => {
        const props = {
            navigationController: {
                pushView: spy()
            },
            dispatch: spy(),
            availableSlots: {
                '2017-03-31': [
                    '02:00 PM'
                ]
            }
        };
        const day = moment.utc();

        before((done) => {
            const component = renderShallow(<StaffCalendar {...props} />).output;
            const dayPicker = findWithType(component, DayPicker);
            setTimeout(() => {
                dayPicker.props.onDayClick(day);
                done();
            });
        });

        it(`dispatches ${DATE_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                { type: DATE_SELECTED, date: day }
            );
        });

        it('calls navigationController.pushView with StaffSlots', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffSlots
                  date={day}
                  navigationController={props.navigationController}
              />
            );
        });
    });

    context('when go back is clicked', () => {
        const props = {
            navigationController: {
                popView: spy()
            },
            dispatch: noop,
            availableSlots: {
                '2017-03-31': [
                    '02:00 PM'
                ]
            }
        };

        before(() => {
            const component = renderShallow(<StaffCalendar {...props} />).output;
            const nav = findWithType(component, Nav);
            nav.props.leftClick();
        });

        it('calls navigationController.popView', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const navigationController = {
            pushView: noop
        };
        const selectedStaffMember = {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots:
            {
                '2017-04-01': ['7:00 PM', '8:00 PM']
            }
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <StaffCalendarConnected
                  store={store}
                  navigationController={navigationController}
              />
           ).output;
        });
        it('renders StaffCalendar with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffCalendar
                  dispatch={noop}
                  store={store}
                  navigationController={navigationController}
                  availableSlots={selectedStaffMember.availableSlots}
              />
            );
        });
    });
});
