import { STAFF_SELECTED, STAFF_FETCHED, DATE_SELECTED } from 'src/js/action-types';

export const initialState = {
    staffMembers: [],
};
export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
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
