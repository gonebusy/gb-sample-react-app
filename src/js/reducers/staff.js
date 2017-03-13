import { STAFF_SELECTED } from 'src/js/action-types';

export const initialState = {
    staffMembers: [
        {
            id: 1,
            imagePath: 'http://i.pravatar.cc/300?img=69',
            name: 'James Hunter'
        },
        {
            id: 2,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Selena Yamada'
        },
        {
            id: 3,
            imagePath: 'http://i.pravatar.cc/300?img=32',
            name: 'Sarah Belmoris'
        },
        {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry'
        }
    ],
    selectedStaffMember: {}
};

export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case STAFF_SELECTED: {
            const { staffMember } = action;
            return {
                ...state,
                selectedStaffMember: staffMember
            };
        }
        default: {
            return state;
        }
    }
};
