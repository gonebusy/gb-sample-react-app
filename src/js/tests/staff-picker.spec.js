import { expect } from 'chai';
import React from 'react';
import { findAllWithType } from 'react-shallow-testutils';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import * as staffActions from 'src/js/actions/staff';
import { createNew } from 'src/js/store';
import noop from '../../../lib/util/noop';
import StaffPickerConnected, { StaffPicker } from '../components/staff-picker';
import Nav from '../components/nav';
import StaffMember from '../components/staff-member';
import StaffCalendar from '../components/staff-calendar';

describe('<StaffPicker>', () => {
    context('when rendered', () => {
        let component;
        const props = {
            navigationController: {
                pushView: spy()
            },
            staffMembers: [
                {
                    id: 1,
                    imagePath: 'http://i.pravatar.cc/300?img=69',
                    name: 'James Hunter'
                },
                {
                    id: 2,
                    imagePath: 'http://i.pravatar.cc/300?img=25',
                    name: 'Selena Yamada'
                },
                {
                    id: 3,
                    imagePath: 'http://i.pravatar.cc/300?img=32',
                    name: 'Sarah Belmoris'
                },
                {
                    id: 4,
                    imagePath: 'http://i.pravatar.cc/300?img=15',
                    name: 'Phillip Fry'
                }
            ],
            dispatch: noop
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
            },
            staffMembers: [
                {
                    id: 1,
                    imagePath: 'http://i.pravatar.cc/300?img=69',
                    name: 'James Hunter'
                },
                {
                    id: 2,
                    imagePath: 'http://i.pravatar.cc/300?img=25',
                    name: 'Selena Yamada'
                },
                {
                    id: 3,
                    imagePath: 'http://i.pravatar.cc/300?img=32',
                    name: 'Sarah Belmoris'
                },
                {
                    id: 4,
                    imagePath: 'http://i.pravatar.cc/300?img=15',
                    name: 'Phillip Fry'
                }
            ],
            dispatch: spy()
        };

        before(() => {
            stub(staffActions, 'selectStaff').withArgs(props.staffMembers[0]);
            const component = renderShallow(
              <StaffPicker {...props} />
            ).output;

            const firstStaffMember = findAllWithType(component, StaffMember)[0];
            firstStaffMember.props.onStaffClick();
        });

        after(() => {
            staffActions.selectStaff.restore();
        });

        it('invokes selectStaff action', () => {
            expect(props.dispatch).to.have.been.calledWith(
                staffActions.selectStaff(props.staffMembers[0])
            );
        });

        it('navigates to <StaffCalendar> through navigationController', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffCalendar {...props.staffMembers[0]} />
            );
        });
    });

    context(('when it is connected'), () => {
        let store;
        let component;
        const navigationController = {
            pushView: noop
        };
        const staffMembers = [
            {
                id: 1,
                imagePath: 'http://i.pravatar.cc/300?img=69',
                name: 'James Hunter'
            },
            {
                id: 2,
                imagePath: 'http://i.pravatar.cc/300?img=25',
                name: 'Selena Yamada'
            },
            {
                id: 3,
                imagePath: 'http://i.pravatar.cc/300?img=32',
                name: 'Sarah Belmoris'
            },
            {
                id: 4,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            }
        ];

        before(() => {
            store = createNew({ staff: { staffMembers } });
            component = renderShallow(
              <StaffPickerConnected
                  store={store}
                  navigationController={navigationController}
              />).output;
        });
        it('renders StaffPicker with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffPicker
                  dispatch={noop}
                  store={store}
                  staffMembers={staffMembers}
                  navigationController={navigationController}
              />
            );
        });
    });
});
