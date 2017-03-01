import { expect } from 'chai';
import React from 'react';
import DayPicker from 'react-day-picker';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import mockEvent from '../../../lib/util/mock-event';
import Nav from '../components/nav';
import StaffCalendar from '../components/staff-calendar';
import StaffMember from '../components/staff-member';
import StaffSlots from '../components/staff-slots';

describe('<StaffCalendar>', () => {
    context('when rendered with props', () => {
        let component;
        let goBack;
        let handleDayClick;
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {}
        };

        before(() => {
            const { instance: getInstance, output } = renderShallow(<StaffCalendar {...props} />);
            const instance = getInstance();
            goBack = instance.goBack;
            handleDayClick = instance.handleDayClick;
            component = output;
        });

        it('renders a staff calendar', () => {
            expect(component).to.eql(
              <div className="staff-calendar">
                <Nav leftClick={() => goBack()}>
                  <StaffMember imagePath={props.imagePath} name={props.name} />
                </Nav>

                <div className="staff-calendar-picker">
                  <DayPicker
                      onDayClick={handleDayClick()}
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
            }
        };
        const day = { someDay: 1 };

        before(() => {
            const { instance: getInstance } = renderShallow(<StaffCalendar {...props} />);
            const instance = getInstance();
            instance.handleDayClick()(mockEvent, day);
        });

        it('calls navigationController.pushView with StaffSlots', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffSlots date={day} {...props} />
            );
        });
    });

    context('when go back is clicked', () => {
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                popView: spy()
            }
        };

        before(() => {
            const { instance: getInstance } = renderShallow(<StaffCalendar {...props} />);
            const instance = getInstance();
            instance.goBack();
        });

        it('calls navigationController.popView', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });
});
