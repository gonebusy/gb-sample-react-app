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
import StaffMember from '../components/staff-member';
import StaffSlots from '../components/staff-slots';


describe('<StaffCalendar>', () => {
    context('when rendered with props', () => {
        let component;
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {},
            dispatch: noop
        };

        before(() => {
            component = renderShallow(<StaffCalendar {...props} />).output;
        });

        it('renders a staff calendar', () => {
            expect(component).to.eql(
              <div className="staff-calendar">
                <Nav leftClick={() => noop()}>
                  <StaffMember imagePath={props.imagePath} name={props.name} />
                </Nav>

                <div className="staff-calendar-picker">
                  <DayPicker
                      onDayClick={noop}
                      weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                  />
                </div>
              </div>
            );
        });
    });

    context('when a calendar day is clicked', () => {
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                pushView: spy()
            },
            dispatch: spy()
        };
        const day = moment();

        before(() => {
            const component = renderShallow(<StaffCalendar {...props} />).output;
            const dayPicker = findWithType(component, DayPicker);
            dayPicker.props.onDayClick(day);
        });

        it(`dispatches ${DATE_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                { type: DATE_SELECTED, date: moment(day) }
            );
        });

        it('calls navigationController.pushView with StaffSlots', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffSlots
                  date={day}
                  imagePath={props.imagePath}
                  name={props.name}
                  navigationController={props.navigationController}
              />
            );
        });
    });

    context('when go back is clicked', () => {
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                popView: spy()
            },
            dispatch: noop
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
            availableSlots: [
                {
                    date: '2017-04-01',
                    slots: ['7:00', '8:00']
                }
            ]
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
                  imagePath={selectedStaffMember.imagePath}
                  name={selectedStaffMember.name}
                  navigationController={navigationController}
              />
            );
        });
    });
});
