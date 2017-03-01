import { expect } from 'chai';
import React from 'react';
import { findAllWithType } from 'react-shallow-testutils';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import noop from '../../../lib/util/noop';
import StaffPicker from '../components/staff-picker';
import Nav from '../components/nav';
import StaffMember from '../components/staff-member';
import StaffCalendar from '../components/staff-calendar';

describe('<StaffPicker>', () => {
    context('when rendered', () => {
        let component;
        const props = {
            navigationController: {
                popView: spy()
            }
        };

        before(() => {
            component = renderShallow(
              <StaffPicker {...props} />).output;
        });

        it('renders with staff members', () => {
            expect(component).to.eql(
              <div className="staff-picker">
                <Nav>Choose a Staff Member</Nav>
                <div className="staff">
                  <StaffMember
                      onStaffClick={noop}
                      imagePath="http://i.pravatar.cc/300?img=69"
                      name="James Hunter"
                  />
                  <StaffMember
                      onStaffClick={noop}
                      imagePath="http://i.pravatar.cc/300?img=25"
                      name="Selena Yamada"
                  />
                  <StaffMember
                      onStaffClick={noop}
                      imagePath="http://i.pravatar.cc/300?img=32"
                      name="Sarah Belmoris"
                  />
                  <StaffMember
                      onStaffClick={noop}
                      imagePath="http://i.pravatar.cc/300?img=15"
                      name="Phillip Fry"
                  />
                </div>
              </div>
            );
        });
    });

    context('when staff member is clicked', () => {
        const props = {
            navigationController: {
                pushView: spy()
            }
        };

        let firstStaffMemberProps;

        before(() => {
            const component = renderShallow(
              <StaffPicker {...props} />
            ).output;

            const firstStaffMember = findAllWithType(component, StaffMember)[0];
            firstStaffMemberProps = firstStaffMember.props;
            firstStaffMember.props.onStaffClick({ ...firstStaffMemberProps });
        });

        it('navigates to <StaffCalendar> through navigationController', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffCalendar {...firstStaffMemberProps} />
            );
        });
    });
});
