import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { findWithType } from 'react-shallow-testutils';
import { spy } from 'sinon';
import noop from '../../../lib/util/noop';
import Nav from '../components/nav';
import StaffForm from '../components/staff-form';
import StaffMember from '../components/staff-member';

describe('<StaffForm>', () => {
    context('when rendered with required props for StaffForm', () => {
        const props = {
            slot: `${dateFormat(new Date('2017-02-01'), 'dddd, d mmm yyyy', true)} 11:15`,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler'
        };

        let component;

        before(() => {
            component = renderShallow(
              <StaffForm {...props} />).output;
        });

        it('renders report form with default values', () => {
            expect(component).to.eql(
              <div className="staff-form">
                <Nav leftClick={noop}>
                  <StaffMember imagePath="http://i.pravatar.cc/300?img=25" name="Peter Pickler" />
                </Nav>

                <div className="staff-slots-date">Wednesday, 1 Feb 2017 11:15</div>

                <div className="staff-form__form">
                  <div className="staff-form__form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" required="required" />
                  </div>
                  <div className="staff-form__form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" required="required" />
                  </div>
                  <button className="staff-form__confirm-btn">Confirm Booking</button>
                </div>
              </div>
            );
        });
    });

    context('when go back button is clicked', () => {
        const props = {
            slot: `${dateFormat(new Date('2017-02-01'), 'dddd, d mmm yyyy', true)} 11:15`,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            navigationController: {
                popView: spy()
            }
        };

        before(() => {
            const component = renderShallow(
              <StaffForm {...props} />
            ).output;

            const navElement = findWithType(component, Nav);
            navElement.props.leftClick();
        });

        it('calls the popView function of navigationController', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });
});
