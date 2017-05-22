import {
    SLOTS_FETCHED,
    STAFF_FETCHED, DATE_SELECTED
} from 'src/js/action-types';
import find from 'lodash.find';

export const initialState = {
    staffMembers: [],
    allAvailableSlots: {},
    selectedStaffMember: {
        imagePath: '',
        name: ''
    }
};
export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case SLOTS_FETCHED: {
            const {
                availableSlots,
                id,
                month
            } = action;
            const staffMember = find(state.staffMembers, staff => (staff.id === id));
            return {
                ...state,
                selectedStaffMember: {
                    ...staffMember,
                    availableSlots
                },
                allAvailableSlots: {
                    ...state.allAvailableSlots,
                    [id]: {
                        ...state.allAvailableSlots[id],
                        [month]: availableSlots
                    }
                }
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
