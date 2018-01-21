import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import { findAllWithType } from 'react-shallow-testutils';
import moment from 'moment';
import * as staffActions from 'src/js/actions/staff';
import { getYYYYMMPath } from 'src/js/utils/date';
import noop from '../../../lib/util/noop';
import CustomCalNavBar from '../components/custom-cal-nav-bar';

describe('<CustomCalNavBar>', () => {
    context('when rendered on the current month', () => {
        let component;
        before(() => {
            const router = { goBack: noop() };
            component = renderShallow(
              <CustomCalNavBar
                  className="some-class"
                  previousMonth={moment.utc().subtract(1, 'months')}
                  router={router}
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
        const router = { goBack: noop() };
        const goBackHandler = router.goBack;
        before(() => {
            component = renderShallow(
              <CustomCalNavBar
                  className="some-class"
                  previousMonth={moment.utc().add(1, 'months')}
                  router={router}
              />
            ).output;
        });

        it('has previous and next buttons enabled', () => {
            expect(component).to.eql(
              <div className="some-class" style={{ fontSize: '.75em' }}>
                <span
                    className="DayPicker-NavButton DayPicker-NavButton--prev"
                    onClick={goBackHandler}
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
        const currentMonth = moment.utc();
        const previousMonth = currentMonth.subtract(1, 'months');
        const nextMonth = currentMonth.add(1, 'months');
        const id = 'bafd0c76-fed7-11e7-8be5-0ed5f89f718b';
        const router = { goBack: noop(), push: spy() };
        const props = {
            nextMonth,
            previousMonth,
            className: 'some-class',
            id,
            router
        };

        before(() => {
            const component = renderShallow(
              <CustomCalNavBar
                  {...props}
              />).output;
            const nextMonthButton = findAllWithType(component, 'span')[1];
            nextMonthButton.props.onClick();
        });

        it('pushes router with next month as parameter', () => {
            expect(router.push).to.have.been.calledWith(
                `/staff/${id}/available_slots/${getYYYYMMPath(nextMonth)}`
            );
        });

    });
    context('when previous month navigator is clicked', () => {
        // since previousMonth is only enabled after going past the current month,
        // adding 2 for nextMonth and 1 for previousMonth
        const nextMonth = moment.utc().add(2, 'months');
        const previousMonth = moment.utc().add(1, 'months');
        const id = 'c5f6e336-fed7-11e7-8be5-0ed5f89f718b';
        const router = { goBack: spy() };
        const props = {
            dispatch: spy(),
            nextMonth,
            previousMonth,
            className: 'some-class',
            id,
            router
        };

        before((done) => {
            stub(staffActions, 'fetchSlotsForResource').returns(Promise.resolve({}));
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

        after(() => {
            staffActions.fetchSlotsForResource.restore();
        });
        it('calls dispatch with fetchSlots and selectMonth with previous month', () => {
            expect(router.goBack).to.have.been.called();
        });
    });
});
