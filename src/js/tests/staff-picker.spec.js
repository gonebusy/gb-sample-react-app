import { expect } from 'chai';
import React from 'react';
import { findAllWithType } from 'react-shallow-testutils';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import { MONTH_SELECTED, STAFF_SELECTED } from 'src/js/action-types';
import request from 'superagent-bluebird-promise';
import { createNew } from 'src/js/store';
import moment from 'moment';
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
        const mockSlotsResponse =
            {
                body: [{
                    available_slots: [
                        {
                            date: '2017-03-27',
                            slots: '2017-03-27T18:00:00Z, 2017-03-27T18:15:00Z'
                        }
                    ],
                    id: 1
                }]
            };

        before((done) => {
            stub(request, 'get').returns(Promise.resolve(mockSlotsResponse));

            const component = renderShallow(
              <StaffPicker {...props} />
            ).output;

            const firstStaffMember = findAllWithType(component, StaffMember)[0];
            setTimeout(() => {
                firstStaffMember.props.onStaffClick();
                done();
            });
        });

        after(() => {
            request.get.restore();
        });

        it('invokes selectStaff action', () => {
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: STAFF_SELECTED,
                    staffMember: props.staffMembers[0],
                }
            );
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: MONTH_SELECTED,
                    month: moment.utc().month()
                }
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
