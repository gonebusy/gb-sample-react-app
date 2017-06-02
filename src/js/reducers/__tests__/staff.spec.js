import { expect } from 'chai';
import {
    SLOTS_FETCHED,
    STAFF_FETCHED,
    DATE_SELECTED
} from 'src/js/action-types';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import moment from 'moment';
import find from 'lodash.find';

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
        const duration = 60;
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
                    duration
                }
            );
            state = store.getState().staff;
        });

        it('adds fetched staffMembers to the store', () => {
            expect(state).to.eql({
                ...initialState,
                staffMembers,
                duration
            });
        });

    });

    context(`${DATE_SELECTED} is dispatched`, () => {
        context('and there are available slots for that date', () => {
            let state;
            const formattedDate = '2017-04-01';
            const date = moment(formattedDate);
            const selectedStaffMember = {
                id: '10004', // resourceId
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

    context(`when ${SLOTS_FETCHED} is dispatched`, () => {
        let state;
        const resourceId = 100004;
        const month = 2;
        const year = 2017;
        const nextMonth = month + 1;
        const nextYear = year + 1;
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
                id: resourceId,
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry'
            }
        ];
        const staffMember = find(staffMembers, staff => (staff.id === resourceId));
        const allAvailableSlots = {
            [resourceId]: { // resourceId
                [year]: { // year index
                    [month]: { // month index
                        '2017-03-30': ['6:00 PM', '6:30 PM']
                    }
                }
            },
            100003: {
                [year]: { // year index
                    2: {
                        '2017-03-31': ['12:00 PM', '12:30 PM']
                    }
                }
            }
        };

        const fetchedAvailableSlots = {
            [resourceId]: { // resourceId
                [year]: { // year index
                    [nextMonth]: { // month index
                        '2017-04-30': ['6:00 PM', '6:30 PM']
                    }
                },
                [nextYear]: { // year index
                    [nextMonth]: { // month index
                        '2018-04-30': ['6:00 PM', '6:30 PM']
                    }
                }
            }
        };
        const startDate = moment.utc();
        const dayPickerMonth = startDate.toDate();

        context('and there availableSlots do not already exist in the state', () => {
            const availableSlots = allAvailableSlots[resourceId][year][month];
            before(() => {

                const store = createNew({ staff: { ...initialState, staffMembers } });
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month,
                        year,
                        fetchedDate: startDate,
                        dayPickerMonth
                    }
                );
                state = store.getState().staff;
            });
            it('sets allavailableSlots and selected staff in the store', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    allAvailableSlots: { [resourceId]: { [year]: { [month]: availableSlots } } },
                    selectedStaffMember: {
                        ...staffMember,
                        availableSlots,
                        dayPickerMonth,
                        selectedDate: startDate
                    }
                });
            });
        });

        context('and there availableSlots already exist in the state', () => {
            const availableSlots = fetchedAvailableSlots[resourceId][year][nextMonth];
            before(() => {

                const store = createNew(
                    { staff: { ...initialState, allAvailableSlots, staffMembers } }
                );
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month: nextMonth,
                        year,
                        fetchedDate: startDate,
                        dayPickerMonth
                    }
                );
                state = store.getState().staff;
            });
            it('merges allAvailableSlots', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    selectedStaffMember: {
                        ...staffMember,
                        availableSlots,
                        selectedDate: startDate,
                        dayPickerMonth
                    },
                    allAvailableSlots: {
                        ...allAvailableSlots,
                        [resourceId]: {
                            [year]: {
                                ...allAvailableSlots[resourceId][year],
                                ...fetchedAvailableSlots[resourceId][year]
                            }
                        }
                    }
                });
            });
        });

        context('and the following year has been fetched', () => {
            const availableSlots = fetchedAvailableSlots[resourceId][nextYear][nextMonth];
            before(() => {

                const store = createNew(
                    { staff: { ...initialState, allAvailableSlots, staffMembers } }
                );
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month: nextMonth,
                        year: nextYear,
                        fetchedDate: startDate,
                        dayPickerMonth
                    }
                );
                state = store.getState().staff;
            });
            it('merges allAvailableSlots with the following year', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    selectedStaffMember: {
                        ...staffMember,
                        availableSlots,
                        selectedDate: startDate,
                        dayPickerMonth
                    },
                    allAvailableSlots: {
                        ...allAvailableSlots,
                        [resourceId]: {
                            ...allAvailableSlots[resourceId],
                            [nextYear]: fetchedAvailableSlots[resourceId][nextYear]
                        }
                    }
                });
            });
        });

    });
});
