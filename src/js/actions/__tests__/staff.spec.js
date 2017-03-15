import { expect } from 'chai';
import { spy } from 'sinon';
import { selectStaff } from 'src/js/actions/staff';
import { STAFF_SELECTED } from 'src/js/action-types';

describe('staff action creators', () => {
    describe('selectStaff', () => {
        context('when invoked', () => {
            const dispatch = spy();
            const staffMember = {
                id: 4,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            };

            before(() => {
                selectStaff(staffMember)(dispatch);
            });

            it(`dispatches with ${STAFF_SELECTED}`, () => {
                expect(dispatch).to.have.been.calledWith({
                    type: STAFF_SELECTED,
                    staffMember,
                    availableSlots: {
                        '2017-04-01': ['7:00', '8:00']
                    }
                });
            });
        });
    });
});
