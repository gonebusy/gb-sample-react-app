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
import StaffCalendarConnected, { StaffCalendar } from '../components/staff-calendar';
import CustomCalNavBar from '../components/custom-cal-nav-bar';


describe('<StaffCalendar>', () => {
    context('when rendered with props', () => {
        let component;
        const startDate = moment.utc('2017-03-31');
        const startDateFormatted = startDate.format('YYYY-MM-DD');
        const dayPickerMonth = startDate.toDate();
        const props = {
            router: {},
            dispatch: noop,
            availableSlots: {
                [startDateFormatted]: [
                    '02:00 PM'
                ]
            },
            dayPickerMonth,
            id: '10001',
            style: { styleAttr: 'some-style' }
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
              <div className="staff-calendar" style={props.style}>
                <div className="staff-calendar-picker">
                  <DayPicker
                      onDayClick={noop}
                      weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                      disabledDays={disabledDates}
                      navbarElement={
                        <CustomCalNavBar
                            dispatch={props.dispatch}
                        />
                      }
                      month={dayPickerMonth}
                  />
                </div>
              </div>
            );
        });
    });

    context('when a calendar day is clicked', () => {
        const startDateFormatted = '2017-03-31';
        const day = moment.utc(startDateFormatted);
        const id = '10001';
        const props = {
            router: {
                push: spy()
            },
            dispatch: spy(),
            availableSlots: {
                [startDateFormatted]: [
                    '02:00 PM'
                ]
            },
            id,
            dayPickerMonth: day.toDate(),
            style: { styleAttr: 'some-style' }
        };

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

        it(
            `pushes /staff/${id}/available_slots/${startDateFormatted}/start`, () => {
                expect(props.router.push).to.have.been.calledWith(
                `/staff/${id}/available_slots/${startDateFormatted}/start`
            );
            });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const router = {};
        const id = '10004';
        const startDateFormatted = '2017-04-01';
        const day = moment.utc(startDateFormatted);
        const style = { styleAttribute: 'some-style' };
        const selectedStaffMember = {
            id,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots:
            {
                [startDateFormatted]: ['7:00 PM', '8:00 PM']
            },
            dayPickerMonth: day.toDate()
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <StaffCalendarConnected
                  store={store}
                  router={router}
                  style={style}
              />
           ).output;
        });
        it('renders StaffCalendar with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffCalendar
                  dispatch={noop}
                  store={store}
                  availableSlots={selectedStaffMember.availableSlots}
                  router={router}
                  id={id}
                  dayPickerMonth={selectedStaffMember.dayPickerMonth}
                  style={style}
              />
            );
        });
    });
});
