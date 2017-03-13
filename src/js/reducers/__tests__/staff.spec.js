import { expect } from 'chai';
import { STAFF_SELECTED } from 'src/js/action-types';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';

describe('staff reducers', () => {
    context('when store is initiated', () => {
        let state;
        before(() => {
            const store = createNew();
            state = store.getState().staff;
        });
        it('has the state populated with staff', () => {
            expect(state).to.eql(initialState);
        });
    });

    context(`${STAFF_SELECTED} is dispatched`, () => {
        let state;
        const selectedStaffMember = {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry'
        };

        before(() => {
            const store = createNew();
            store.dispatch(
                {
                    type: STAFF_SELECTED,
                    staffMember: selectedStaffMember
                }
            );
            state = store.getState().staff;
        });

        it('adds the selected staff member to selectedStaffMember', () => {
            expect(state).to.eql({
                ...initialState,
                selectedStaffMember
            });
        });

    });
});
