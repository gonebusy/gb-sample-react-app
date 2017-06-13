import {
    SLOTS_FETCHED,
    STAFF_FETCHED, DATE_SELECTED,
    CLEAR_SELECTED_STAFF_MEMBER,
    TIME_SLOT_SELECTED,
    IS_LOADING
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
    loading: true
};
export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case IS_LOADING: {
            return {
                ...state,
                loading: true
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
            const staffMember = find(state.staffMembers, staff => (staff.id === id));
            return {
                ...state,
                selectedStaffMember: {
                    ...staffMember,
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
            const { staffMembers, duration } = action;
            return {
                ...state,
                staffMembers,
                duration
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
            const { availableSlots } = state.selectedStaffMember;
            const formattedDate = date.format('YYYY-MM-DD');
            const slotsForDate = formattedDate in availableSlots ?
                availableSlots[formattedDate] : [];
            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    selectedDate: date,
                    slotsForDate,
                    slotForm: 'start'
                }
            };
        }
        case TIME_SLOT_SELECTED: {
            const { slotTime, slotType } = action;
            let remainingSlots = state.selectedStaffMember.slotsForDate;
            if (slotType === 'startTime') {
                const { slotsForDate, selectedDate } = state.selectedStaffMember;
                const index = slotsForDate.indexOf(slotTime);
                let slotsToCalculateEndTimes;
                if (slotsForDate.length > 1)
                    slotsToCalculateEndTimes = slotsForDate.slice(index);
                else
                    slotsToCalculateEndTimes = slotsForDate;
                const endTimes = [];
                for (let i = 0; i < slotsToCalculateEndTimes.length; i += 1) {
                    const lastStartTime = moment.utc(
                        `${selectedDate.format('YYYY-MM-DD')} ${slotsToCalculateEndTimes[i]}`,
                        ['YYYY-MM-DD h:mm A']
                    );
                    const endingSlot = lastStartTime.add(state.duration, 'minutes');
                    endTimes.push(endingSlot.format('h:mm A'));
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
