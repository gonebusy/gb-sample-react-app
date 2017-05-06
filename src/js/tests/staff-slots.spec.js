import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import moment from 'moment';
import noop from 'lib/util/noop';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import { findWithType, findAllWithType } from 'react-shallow-testutils';
import Nav from '../components/nav';
import StaffSlotsConnected, { StaffSlots } from '../components/staff-slots';
import StaffForm from '../components/staff-form';

describe('<StaffSlots>', () => {
    context('when rendered with slots', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: currentDate,
            navigationController: {},
            slots
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <Nav leftClick={() => noop} />

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
                  <ul className="staff-slots-times">
                    <li className="staff-slots-time" key={0}>
                      <button onClick={noop}>{slots[0]}</button>
                    </li>
                    <li className="staff-slots-time" key={1}>
                      <button onClick={noop}>{slots[1]}</button>
                    </li>
                    <li className="staff-slots-time" key={2}>
                      <button onClick={noop}>{slots[2]}</button>
                    </li>
                    <li className="staff-slots-time" key={3}>
                      <button onClick={noop}>{slots[3]}</button>
                    </li>
                  </ul>
                </div>
              </div>
            );
        });
    });

    context('when slots are empty', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = [];
        const props = {
            date: currentDate,
            navigationController: {},
            slots
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders no slots available message', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <Nav leftClick={() => noop} />
                <div className="staff-slots-date">{formattedDate}</div>
                <p className="staff-slots-message">No slots available!</p>
              </div>
            );
        });
    });

    context('when time is clicked and start time is not set', () => {
        const currentDate = moment();
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: currentDate,
            navigationController: {
                pushView: spy()
            },
            slots,
            duration: 60
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, 'button')[0];
            firstButton.props.onClick(slots[0]);
        });

        it('calls navigationController.pushView with StaffForm', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffSlots
                  date={props.date}
                  navigationController={props.navigationController}
                  startTime={slots[0]}
                  slots={['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM']}
              />
            );
        });
    });

    context('when go back is clicked', () => {
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: moment(),
            navigationController: {
                popView: spy()
            },
            slots
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const nav = findWithType(component, Nav);
            nav.props.leftClick();
        });

        it('calls navigationController.popView', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });

    context('when start time is set', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const props = {
            date: currentDate,
            navigationController: {},
            slots,
            startTime: '7:00 AM'
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots with end times', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <Nav leftClick={() => noop} />

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your end time</p>
                  <ul className="staff-slots-times">
                    <li className="staff-slots-time" key={0}>
                      <button onClick={noop}>{slots[0]}</button>
                    </li>
                    <li className="staff-slots-time" key={1}>
                      <button onClick={noop}>{slots[1]}</button>
                    </li>
                    <li className="staff-slots-time" key={2}>
                      <button onClick={noop}>{slots[2]}</button>
                    </li>
                    <li className="staff-slots-time" key={3}>
                      <button onClick={noop}>{slots[3]}</button>
                    </li>
                  </ul>
                </div>
              </div>
            );
        });
    });
    context('when time is clicked and start time is set', () => {
        const currentDate = moment();
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const props = {
            date: currentDate,
            navigationController: {
                pushView: spy()
            },
            slots,
            duration: 60,
            startTime: '7:00 AM'
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, 'button')[0];
            firstButton.props.onClick(slots[0]);
        });

        it('calls navigationController.pushView with StaffForm', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffForm
                  date={currentDate}
                  startTime={props.startTime}
                  endTime={'8:00 AM'}
              />
            );
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const navigationController = {
            pushView: noop
        };
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const currentDate = moment();
        const duration = 60;
        const selectedStaffMember = {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots: [
                {
                    date: currentDate,
                    slots
                }
            ],
            selectedDate: currentDate,
            slotsForDate: slots
        };

        before(() => {
            store = createNew({ staff: { ...initialState, duration, selectedStaffMember } });
            component = renderShallow(
              <StaffSlotsConnected
                  store={store}
                  navigationController={navigationController}
              />
            ).output;
        });
        it('renders StaffSlots with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffSlots
                  dispatch={noop}
                  store={store}
                  navigationController={navigationController}
                  slots={slots}
                  date={currentDate}
                  duration={duration}
              />
            );
        });
    });
});
