import request from 'superagent-bluebird-promise';
import { STAFF_SELECTED, STAFF_FETCHED } from 'src/js/action-types';

const images = {
    'James Hunter': 'http://i.pravatar.cc/300?img=69',
    'Selena Yamada': 'http://i.pravatar.cc/300?img=25',
    'Sarah Belmoris': 'http://i.pravatar.cc/300?img=32',
    'Phillip Fry': 'http://i.pravatar.cc/300?img=15'
};

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

export const fetchStaff = () =>
    (dispatch) => {
        request.get('/service').then((response) => {
            const staffMembers = [];
            const resourceIds = response.body;
            const promises = resourceIds.map(resourceId => (
                request.get(`/resources/${resourceId}`).then((resourcesResponse) => {
                    const { id, name } = resourcesResponse.body;
                    staffMembers.push({ id, name, imagePath: images[name] });
                })
            ));
            Promise.all(promises).then(() => (
                dispatch({
                    type: STAFF_FETCHED,
                    staffMembers
                })
            ));
        });
    };

export default selectStaff;
