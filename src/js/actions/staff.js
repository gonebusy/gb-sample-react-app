import request from 'superagent-bluebird-promise';
import moment from 'moment';
import { DATE_SELECTED, STAFF_SELECTED, STAFF_FETCHED } from 'src/js/action-types';

const images = {
    'James Hunter': 'http://i.pravatar.cc/300?img=69',
    'Selena Yamada': 'http://i.pravatar.cc/300?img=25',
    'Sarah Belmoris': 'http://i.pravatar.cc/300?img=32',
    'Phillip Fry': 'http://i.pravatar.cc/300?img=15'
};

const keyOffDate = (availableSlots) => {
    const formattedSlots = {};
    availableSlots.forEach(({ date, slots }) => {
        const formattedDate = moment.utc(date).format('YYYY-MM-DD');
        formattedSlots[formattedDate] = slots.split(',').map(slot => (
            moment.utc(slot).format('h:mm A')
        ));

    });
    return formattedSlots;
};

export const selectStaff = (staffMember, startDate, endDate) =>
    dispatch => (
        request.get(`/slots?startDate=${startDate}&endDate=${endDate}`).then((response) => {
            let availableSlots = {};
            const resources = response.body;
            resources.forEach((resource) => {
                if (parseInt(resource.id, 10) === parseInt(staffMember.id, 10))
                    availableSlots = keyOffDate(resource.available_slots);
            });
            dispatch({
                type: STAFF_SELECTED,
                staffMember,
                availableSlots
            });
        })
    );

export const selectDate = selectedDate =>
    dispatch => (
        new Promise((resolve) => {
            dispatch({ type: DATE_SELECTED, date: selectedDate });
            resolve();
        })
    );

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
