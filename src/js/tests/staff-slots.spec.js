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
import StaffMember from '../components/staff-member';
import StaffSlotsConnected, { StaffSlots } from '../components/staff-slots';
import StaffForm from '../components/staff-form';

describe('<StaffSlots>', () => {
    context('when rendered with props', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00', '7:15', '7:30', '7:45'];
        const props = {
            date: currentDate,
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {},
            slots
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <Nav leftClick={() => noop}>
                  <StaffMember imagePath={props.imagePath} name={props.name} />
                </Nav>

                <div className="staff-slots-date">{formattedDate}</div>
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
            );
        });
    });

    context('when time is clicked', () => {
        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00', '7:15', '7:30', '7:45'];
        const props = {
            date: currentDate,
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                pushView: spy()
            },
            slots
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, 'button')[0];
            firstButton.props.onClick(slots[0]);
        });

        it('calls navigationController.pushView with StaffForm', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffForm
                  slot={`${formattedDate} ${slots[0]}`}
                  imagePath={props.imagePath}
                  name={props.name}
              />
            );
        });
    });

    context('when go back is clicked', () => {
        const slots = ['7:00', '7:15', '7:30', '7:45'];
        const props = {
            date: moment(),
            imagePath: 'some/path',
            name: 'someName',
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

    context('when it is connected', () => {
        let store;
        let component;
        const navigationController = {
            pushView: noop
        };
        const slots = ['7:00', '7:15', '7:30', '7:45'];
        const currentDate = moment();
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
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
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
                  imagePath={selectedStaffMember.imagePath}
                  name={selectedStaffMember.name}
                  navigationController={navigationController}
                  slots={slots}
                  date={currentDate}
              />
            );
        });
    });
});
