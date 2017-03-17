import { expect } from 'chai';
import { STAFF_SELECTED, DATE_SELECTED } from 'src/js/action-types';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import moment from 'moment';

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
        const availableSlots = [
            {
                date: '2017-04-01',
                slots: ['7:00', '8:00']
            }
        ];
        const selectedStaffMember = {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots
        };

        before(() => {
            const store = createNew();
            store.dispatch(
                {
                    type: STAFF_SELECTED,
                    staffMember: selectedStaffMember,
                    availableSlots
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
    context(`${DATE_SELECTED} is dispatched`, () => {
        context('and there are available slots for that date', () => {
            let state;
            const formattedDate = '2017-04-01';
            const date = moment(formattedDate);
            const selectedStaffMember = {
                id: 4,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry',
                availableSlots: {
                    '2017-04-01': ['7:00', '8:00']
                }
            };
            before(() => {
                const store = createNew({ staff: { ...initialState, selectedStaffMember } });
                store.dispatch(
                    {
                        type: DATE_SELECTED,
                        date
                    }
                );
                state = store.getState().staff;
            });

            it('adds the selected date and available slots to selectedStaffMember', () => {
                expect(state).to.eql({
                    ...initialState,
                    selectedStaffMember: {
                        ...state.selectedStaffMember,
                        selectedDate: date,
                        slotsForDate: selectedStaffMember.availableSlots[formattedDate]
                    }
                });
            });

        });

        context('and there are NO available slots for that date', () => {
            let state;
            const oldDate = moment('1970-10-15');
            before(() => {
                const selectedStaffMember = {
                    id: 4,
                    imagePath: 'http://i.pravatar.cc/300?img=15',
                    name: 'Phillip Fry',
                    availableSlots: {
                        '2017-04-01': ['7:00', '8:00']
                    }
                };
                const store = createNew({ staff: { ...initialState, selectedStaffMember } });
                store.dispatch(
                    {
                        type: DATE_SELECTED,
                        date: oldDate
                    }
                );
                state = store.getState().staff;
            });

            it('has an empty array for slotsForDate', () => {
                expect(state).to.eql({
                    ...initialState,
                    selectedStaffMember: {
                        ...state.selectedStaffMember,
                        selectedDate: oldDate,
                        slotsForDate: []
                    }
                });
            });

        });

    });
});
