import request from 'superagent-bluebird-promise';
import moment from 'moment';
import {
    DATE_SELECTED, MONTH_SELECTED, SLOTS_FETCHED,
    STAFF_SELECTED, STAFF_FETCHED
} from 'src/js/action-types';

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

export const fetchSlots = startDate =>
    (dispatch, getState) => {
        const month = startDate.month();
        const anyResourceId = Object.keys(getState().staff.allAvailableSlots).shift();
        if (anyResourceId && getState().staff.allAvailableSlots[anyResourceId][month])
            return new Promise((resolve) => {
                resolve();
            });

        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = startDate.endOf('month').format('YYYY-MM-DD');
        return request.get(
                `/slots?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
            ).then((response) => {
                let availableSlots = {};
                const resources = response.body;
                const allAvailableSlots = {};
                resources.forEach((resource) => {
                    availableSlots = keyOffDate(resource.available_slots);
                    allAvailableSlots[resource.id] = {
                        [month]: availableSlots
                    };
                });
                dispatch({
                    type: SLOTS_FETCHED,
                    allAvailableSlots
                });
            });

    };

export const selectStaff = staffMember =>
    dispatch => (
        new Promise((resolve) => {
            dispatch({
                type: STAFF_SELECTED,
                staffMember
            });
            dispatch({
                type: MONTH_SELECTED,
                month: moment.utc().month()
            });
            resolve();
        })
    );

export const selectDate = selectedDate =>
    dispatch => (
        new Promise((resolve) => {
            dispatch({ type: DATE_SELECTED, date: selectedDate });
            resolve();
        })
    );

export const selectMonth = month =>
    dispatch => (
        new Promise((resolve) => {
            dispatch({ type: MONTH_SELECTED, month });
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
