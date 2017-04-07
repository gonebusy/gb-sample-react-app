import { expect } from 'chai';
import {
    MONTH_SELECTED, SLOTS_FETCHED,
    STAFF_FETCHED, STAFF_SELECTED, DATE_SELECTED
} from 'src/js/action-types';
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

    context(`${STAFF_FETCHED} is dispatched`, () => {
        let state;
        const staffMembers = [
            {
                id: 100001, // resourceId
                imagePath: 'http://i.pravatar.cc/300?img=69',
                name: 'James Hunter'
            },
            {
                id: 100002,
                imagePath: 'http://i.pravatar.cc/300?img=25',
                name: 'Selena Yamada'
            },
            {
                id: 100003,
                imagePath: 'http://i.pravatar.cc/300?img=32',
                name: 'Sarah Belmoris'
            },
            {
                id: 100004,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            }
        ];
        before(() => {
            const store = createNew();
            store.dispatch(
                {
                    type: STAFF_FETCHED,
                    staffMembers,
                }
            );
            state = store.getState().staff;
        });

        it('adds fetched staffMembers to the store', () => {
            expect(state).to.eql({
                ...initialState,
                staffMembers
            });
        });

    });

    context(`${STAFF_SELECTED} is dispatched`, () => {
        let state;
        const selectedStaffMember = {
            id: 100004, // resourceId
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
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
    context(`${DATE_SELECTED} is dispatched`, () => {
        context('and there are available slots for that date', () => {
            let state;
            const formattedDate = '2017-04-01';
            const date = moment(formattedDate);
            const selectedStaffMember = {
                id: 100004, // resourceId
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
                    id: 100004, // resourceId
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

    context(`when ${MONTH_SELECTED} is dispatched`, () => {
        const month = moment.utc('2017-03-01').month();
        let state;
        const allAvailableSlots = {
            100004: { // resourceId
                2: { // month index
                    '2017-03-30': ['6:00 PM', '6:30 PM']
                }
            },
            100003: {
                2: {
                    '2017-03-31': ['12:00 PM', '12:30 PM']
                }
            }
        };
        before(() => {
            const selectedStaffMember = {
                id: 100004, // resourceId
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry',
            };

            const store = createNew(
                { staff: { ...initialState, selectedStaffMember, allAvailableSlots } }
            );
            store.dispatch(
                {
                    type: MONTH_SELECTED,
                    month
                }
            );
            state = store.getState().staff;
        });
        it('sets the staff\'s available slot to the selected month', () => {
            expect(state).to.eql({
                ...initialState,
                allAvailableSlots,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    availableSlots: allAvailableSlots[100004][2]
                }
            });
        });
    });

    context(`when ${SLOTS_FETCHED} is dispatched`, () => {
        let state;
        const allAvailableSlots = {
            100004: { // resourceId
                2: { // month index
                    '2017-03-30': ['6:00 PM', '6:30 PM']
                }
            },
            100003: {
                2: {
                    '2017-03-31': ['12:00 PM', '12:30 PM']
                }
            }
        };

        const fetchedAvailableSlots = {
            100004: { // resourceId
                3: { // month index
                    '2017-04-30': ['6:00 PM', '6:30 PM']
                }
            },
            100003: {
                3: {
                    '2017-04-01': ['12:00 PM', '12:30 PM']
                }
            }
        };
        context('and there availableSlots do not already exist in the state', () => {
            before(() => {

                const store = createNew({ staff: { ...initialState } });
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        allAvailableSlots
                    }
                );
                state = store.getState().staff;
            });
            it('sets allavailableSlots in the store', () => {
                expect(state).to.eql({
                    ...initialState,
                    allAvailableSlots,
                });
            });
        });

        context('and there availableSlots already exist in the state', () => {
            before(() => {

                const store = createNew({ staff: { ...initialState, allAvailableSlots } });
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        allAvailableSlots: fetchedAvailableSlots
                    }
                );
                state = store.getState().staff;
            });
            it('merges allAvailableSlots', () => {
                expect(state).to.eql({
                    ...initialState,
                    allAvailableSlots: {
                        100004: { // resourceId
                            2: { // month index
                                '2017-03-30': ['6:00 PM', '6:30 PM']
                            },
                            3: {
                                '2017-04-30': ['6:00 PM', '6:30 PM']
                            }
                        },
                        100003: {
                            2: {
                                '2017-03-31': ['12:00 PM', '12:30 PM']
                            },
                            3: {
                                '2017-04-01': ['12:00 PM', '12:30 PM']
                            }
                        }
                    },
                });
            });
        });

    });
});
