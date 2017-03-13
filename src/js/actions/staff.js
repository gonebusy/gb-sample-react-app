import { STAFF_SELECTED } from 'src/js/action-types';

export const selectStaff = staffMember =>
    dispatch => (
        dispatch({
            type: STAFF_SELECTED,
            staffMember
        })
    );
export default selectStaff;
