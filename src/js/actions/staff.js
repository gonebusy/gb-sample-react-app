import { STAFF_SELECTED } from 'src/js/action-types';

const getAvailableSlotsForStaff = () => [
    {
        date: '2017-04-01',
        slots: ['7:00', '8:00']
    }
];

const keyOffDate = (availableSlots) => {
    const slots = {};
    availableSlots.forEach((time) => {
        slots[time.date] = time.slots;
    });
    return slots;
};

export const selectStaff = staffMember =>
    (dispatch) => {
        const availableSlots = keyOffDate(getAvailableSlotsForStaff());
        dispatch({
            type: STAFF_SELECTED,
            staffMember,
            availableSlots
        });
    };

export default selectStaff;
