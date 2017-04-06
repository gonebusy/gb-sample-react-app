import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import { findAllWithType } from 'react-shallow-testutils';
import * as staffActions from 'src/js/actions/staff';
import moment from 'moment';
import noop from '../../../lib/util/noop';
import CustomCalNavBar from '../components/custom-cal-nav-bar';
import StaffCalendar from '../components/staff-calendar';

describe('<CustomCalNavBar>', () => {
    context('when rendered', () => {
        let component;
        before(() => {
            component = renderShallow(<CustomCalNavBar className="some-class" />).output;
        });

        it('has customized navigation handlers', () => {
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

    context('when month navigator is clicked', () => {
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
            stub(staffActions, 'fetchSlots').returns(() => (Promise.resolve({})));
            stub(staffActions, 'selectMonth').returns(() => (Promise.resolve({})));
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

        after(() => {
            staffActions.fetchSlots.restore();
            staffActions.selectMonth.restore();
        });

        it('pushes the view to <StaffCalendar>', () => {
            expect(navigationController.pushView).to.have.been.calledWith(
              <StaffCalendar month={nextMonth} />
            );
        });
    });
});
