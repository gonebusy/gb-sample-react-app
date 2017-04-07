import {
    MONTH_SELECTED, SLOTS_FETCHED,
    STAFF_SELECTED, STAFF_FETCHED, DATE_SELECTED
} from 'src/js/action-types';

export const initialState = {
    staffMembers: [],
    allAvailableSlots: {}
};
export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case MONTH_SELECTED: {
            const { month } = action;
            const { id } = state.selectedStaffMember;
            return {
                ...state,
                selectedStaffMember: {
                    ...state.selectedStaffMember,
                    availableSlots: state.allAvailableSlots[id][month]
                }
            };
        }
        case SLOTS_FETCHED: {
            const { allAvailableSlots } = action;
            const updatedAvailableSlots = {};
            Object.keys(allAvailableSlots).forEach((key) => {
                updatedAvailableSlots[key] = {
                    ...state.allAvailableSlots[key],
                    ...allAvailableSlots[key]
                };
            });

            return {
                ...state,
                allAvailableSlots: updatedAvailableSlots
            };
        }
        case STAFF_FETCHED: {
            const { staffMembers } = action;
            return {
                ...state,
                staffMembers
            };
        }
        case STAFF_SELECTED: {
            const { staffMember, availableSlots } = action;
            return {
                ...state,
                selectedStaffMember: {
                    ...staffMember,
                    availableSlots
                },
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
                    slotsForDate
                }
            };
        }
        default: {
            return state;
        }
    }
};
