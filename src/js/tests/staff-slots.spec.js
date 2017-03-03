import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import Nav from '../components/nav';
import StaffMember from '../components/staff-member';
import StaffSlots from '../components/staff-slots';
import StaffForm from '../components/staff-form';

describe('<StaffSlots>', () => {
    context('when rendered with props', () => {
        let component;
        let goBack;
        let timeClick;
        let getInstance;
        let rerender;

        const renderedSlots = [];
        const currentDate = new Date();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00', '7:15', '7:30', '7:45'];
        const props = {
            date: currentDate,
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {}
        };

        before((done) => {
            (
                { instance: getInstance, rerender, output: component } = renderShallow(
                  <StaffSlots {...props} />)
            );
            const instance = getInstance();
            goBack = instance.goBack;
            timeClick = instance.timeClick;
            instance.componentDidMount();
            for (let i = 0; i < slots.length; i += 1)
                renderedSlots.push(
                  <li className="staff-slots-time" key={i}>
                    <button onClick={timeClick(slots[i])}>{slots[i]}</button>
                  </li>
                );

            setTimeout(() => {
                component = rerender();
                done();
            });
        });

        it('renders staff slots', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <Nav leftClick={() => goBack()}>
                  <StaffMember imagePath={props.imagePath} name={props.name} />
                </Nav>

                <div className="staff-slots-date">{formattedDate}</div>
                <ul className="staff-slots-times">
                  {renderedSlots}
                </ul>
              </div>
            );
        });
    });

    context('when time is clicked', () => {
        const currentDate = new Date();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const time = '7:45';
        const props = {
            date: currentDate,
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                pushView: spy()
            }
        };

        before(() => {
            const { instance: getInstance } = renderShallow(<StaffSlots {...props} />);
            const instance = getInstance();
            instance.timeClick(time)();

        });

        it('calls navigationController.pushView with StaffForm', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffForm slot={`${formattedDate} ${time}`} {...props} />
            );
        });
    });

    context('when go back is clicked', () => {
        const props = {
            date: new Date(),
            imagePath: 'some/path',
            name: 'someName',
            navigationController: {
                popView: spy()
            }
        };

        before(() => {
            const { instance: getInstance } = renderShallow(<StaffSlots {...props} />);
            const instance = getInstance();
            instance.goBack();
        });

        it('calls navigationController.popView', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });
});
