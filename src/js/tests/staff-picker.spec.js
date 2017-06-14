import { expect } from 'chai';
import React from 'react';
import { findAllWithType } from 'react-shallow-testutils';
import renderShallow from 'render-shallow';
import { spy, stub } from 'sinon';
import { createNew } from 'src/js/store';
import { getYYYYMMPath } from 'src/js/utils/date';
import moment from 'moment';
import noop from '../../../lib/util/noop';
import StaffPickerConnected, { StaffPicker } from '../components/staff-picker';
import StaffMember from '../components/staff-member';

describe('<StaffPicker>', () => {
    context('when rendered', () => {
        let component;
        const props = {
            router: {
                push: noop
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
        const id = 1;
        const props = {
            router: {
                push: spy()
            },
            staffMembers: [
                {
                    id,
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
            dispatch: stub().returns(Promise.resolve({}))
        };

        before((done) => {
            const component = renderShallow(
              <StaffPicker {...props} />
            ).output;

            const firstStaffMember = findAllWithType(component, StaffMember)[0];
            setTimeout(() => {
                firstStaffMember.props.onStaffClick();
                done();
            });
        });

        it(`router pushes to /staff/${id}`, () => {
            expect(props.router.push).to.have.been.calledWith(
                `/staff/${id}/available_slots/${getYYYYMMPath(moment.utc())}`
            );
        });
    });

    context(('when it is connected'), () => {
        let store;
        let component;
        const router = {
            push: noop
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
                  router={router}
              />).output;
        });
        it('renders StaffPicker with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffPicker
                  dispatch={noop}
                  store={store}
                  staffMembers={staffMembers}
                  router={router}
              />
            );
        });
    });
});
