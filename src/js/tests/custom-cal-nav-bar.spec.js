import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import { findAllWithType } from 'react-shallow-testutils';
import moment from 'moment';
import { TRANSITIONS } from 'src/js/constants';
import noop from '../../../lib/util/noop';
import CustomCalNavBar from '../components/custom-cal-nav-bar';
import StaffCalendar from '../components/staff-calendar';

describe('<CustomCalNavBar>', () => {
    context('when rendered on the current month', () => {
        let component;
        before(() => {
            component = renderShallow(
              <CustomCalNavBar
                  className="some-class"
                  previousMonth={moment.utc().subtract(1, 'months')}
              />
            ).output;
        });

        it('does not have previous month button', () => {
            expect(component).to.eql(
              <div className="some-class" style={{ fontSize: '.75em' }}>
                <span
                    className="DayPicker-NavButton DayPicker-NavButton--next"
                    onClick={() => noop}
                />
              </div>
            );
        });
    });

    context('when rendered on months after the current months', () => {
        let component;
        before(() => {
            component = renderShallow(
              <CustomCalNavBar
                  className="some-class"
                  previousMonth={moment.utc().add(1, 'months')}
              />
            ).output;
        });

        it('has previous and next buttons enabled', () => {
            expect(component).to.eql(
              <div className="some-class" style={{ fontSize: '.75em' }}>
                <span
                    className="DayPicker-NavButton DayPicker-NavButton--prev"
                    onClick={() => noop}
                />
                <span
                    className="DayPicker-NavButton DayPicker-NavButton--next"
                    onClick={() => noop}
                />
              </div>
            );
        });
    });

    context('when next month navigator is clicked', () => {
        const navigationController = { pushView: spy() };
        const currentMonth = moment.utc();
        const previousMonth = currentMonth.subtract(1, 'months');
        const nextMonth = currentMonth.add(1, 'months');
        const props = {
            dispatch: stub().returns(Promise.resolve({})),
            navigationController,
            nextMonth,
            previousMonth,
            className: 'some-class'
        };

        before((done) => {
            const component = renderShallow(
              <CustomCalNavBar
                  {...props}
              />).output;
            const nextMonthButton = findAllWithType(component, 'span')[1];
            setTimeout(() => {
                nextMonthButton.props.onClick();
                done();
            });
        });

        it('pushes the view to <StaffCalendar>', () => {
            expect(navigationController.pushView).to.have.been.calledWith(
              <StaffCalendar month={nextMonth} />, { transition: TRANSITIONS.PUSH_LEFT }
            );
        });
    });
    context('when previous month navigator is clicked', () => {
        const navigationController = { pushView: spy() };
        const currentMonth = moment.utc();
        const previousMonth = currentMonth.subtract(1, 'months');
        const nextMonth = currentMonth.add(1, 'months');
        const props = {
            dispatch: stub().returns(Promise.resolve({})),
            navigationController,
            nextMonth,
            previousMonth,
            className: 'some-class'
        };

        before((done) => {
            const component = renderShallow(
              <CustomCalNavBar
                  {...props}
              />).output;
            const previousMonthButton = findAllWithType(component, 'span')[0];
            setTimeout(() => {
                previousMonthButton.props.onClick();
                done();
            });
        });

        it('pushes the view to <StaffCalendar>', () => {
            expect(navigationController.pushView).to.have.been.calledWith(
              <StaffCalendar month={nextMonth} />, { transition: TRANSITIONS.PUSH_RIGHT }
            );
        });
    });
});
