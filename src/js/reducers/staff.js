import {
    SLOTS_FETCHED,
    STAFF_FETCHED, DATE_SELECTED,
    CLEAR_SELECTED_STAFF_MEMBER,
    TIME_SLOT_SELECTED,
    IS_LOADING, BOOKINGS_FETCHED,
    STAFF_SELECTED, CLEAR_AVAILABLE_SLOTS
} from 'src/js/action-types';
import lodashGet from 'lodash.get';
import find from 'lodash.find';
import moment from 'moment';

export const initialState = {
    staffMembers: [],
    allAvailableSlots: {},
    selectedStaffMember: {
        imagePath: '',
        name: '',
        availableSlots: {},
        dayPickerMonth: new Date(),
        slotsForDate: [],
        slotForm: 'start',
        selectedDate: moment.utc(),
        id: '',
        startTime: '',
        endTime: ''
    },
    loading: true,
    duration: 60,
    maxDuration: 90
};
export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case IS_LOADING: {
            const { loading } = action;
            return {
                ...state,
                loading
            };
        }
        case STAFF_SELECTED: {
            const { id } = action;
            const staffMember = find(state.staffMembers, staff => (staff.id === id));
            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    ...staffMember
                }
            };
        }
        case SLOTS_FETCHED: {
            const {
                availableSlots,
                id,
                month,
                year,
                dayPickerMonth,
                fetchedDate,
                loading
            } = action;
            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    availableSlots,
                    selectedDate: fetchedDate,
                    dayPickerMonth
                },
                allAvailableSlots: {
                    ...state.allAvailableSlots,
                    [id]: {
                        ...state.allAvailableSlots[id],
                        [year]: {
                            ...lodashGet(state.allAvailableSlots[id], year, {}),
                            [month]: availableSlots
                        }
                    }
                },
                loading
            };
        }
        case STAFF_FETCHED: {
            const { staffMembers, duration, maxDuration } = action;
            return {
                ...state,
                staffMembers,
                duration,
                maxDuration
            };
        }
        case BOOKINGS_FETCHED: {
            const { bookingsByResource } = action;
            return {
                ...state,
                bookingsByResource
            };
        }
        case CLEAR_AVAILABLE_SLOTS: {
            const { id } = action;
            const updatedSlots = state.allAvailableSlots;
            delete updatedSlots[id];
            return {
                ...state,
                allAvailableSlots: updatedSlots
            };
        }
        case CLEAR_SELECTED_STAFF_MEMBER: {
            const { selectedStaffMember } = initialState;
            return {
                ...state,
                selectedStaffMember
            };
        }
        case DATE_SELECTED: {
            const { date } = action;
            const { availableSlots, id } = state.selectedStaffMember;
            const formattedDate = date.format('YYYY-MM-DD');
            const slotsForDate = formattedDate in availableSlots ?
                availableSlots[formattedDate] : [];
            let bookingsForDate = [];
            if (state.bookingsByResource[id] && state.bookingsByResource[id][formattedDate])
                bookingsForDate = state.bookingsByResource[id][formattedDate];
            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    selectedDate: date,
                    slotsForDate,
                    slotForm: 'start',
                    bookingsForDate
                }
            };
        }
        case TIME_SLOT_SELECTED: {
            const { slotTime, slotType } = action;
            let remainingSlots = state.selectedStaffMember.slotsForDate;
            if (slotType === 'startTime') {
                const { slotsForDate, selectedDate } = state.selectedStaffMember;
                const startTimeIndex = slotsForDate.indexOf(slotTime);
                const slotsToCalculateEndTimes = slotsForDate.length > 1
                    ? slotsForDate.slice(startTimeIndex) : slotsForDate;
                const startTime = moment.utc(
                    `${selectedDate.format('YYYY-MM-DD')} ${slotsToCalculateEndTimes[0]}`,
                    ['YYYY-MM-DD h:mm A']
                );
                const lastPossibleSlotWithMaxDuration = moment.utc(
                    `${selectedDate.format('YYYY-MM-DD')} ${slotsToCalculateEndTimes[0]}`,
                    ['YYYY-MM-DD h:mm A']
                ).add(state.maxDuration, 'minutes');

                const endTimes = [];
                let endingSlot = startTime;
                let i = 0;
                while (endingSlot.isBefore(lastPossibleSlotWithMaxDuration)) {
                    const startSlot = moment.utc(
                        `${selectedDate.format('YYYY-MM-DD')} ${slotsToCalculateEndTimes[i]}`,
                        ['YYYY-MM-DD h:mm A']
                    );
                    endingSlot = startSlot.add(state.duration, 'minutes');
                    endTimes.push(endingSlot.format('h:mm A'));
                    i += 1;
                }
                remainingSlots = endTimes;
            }

            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    [slotType]: slotTime,
                    slotsForDate: remainingSlots,
                    slotForm: 'end'
                }
            };
        }

        default: {
            return state;
        }
    }
};
