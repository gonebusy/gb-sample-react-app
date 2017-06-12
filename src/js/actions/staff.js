import request from 'superagent-bluebird-promise';
import moment from 'moment';
import {
    DATE_SELECTED, SLOTS_FETCHED,
    STAFF_FETCHED
} from 'src/js/action-types';
import * as urls from 'src/js/urls';

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
        formattedSlots[formattedDate] = slots.map(slot => (
            moment.utc(slot).format('h:mm A')
        ));

    });
    return formattedSlots;
};

export const alreadyFetched = (allAvailableSlots, resourceId, year, month) => {
    const resourceSlots = allAvailableSlots[resourceId];
    return resourceSlots && resourceSlots[year] && resourceSlots[year][month];
};

export const fetchSlotsForResource = (startDate, resourceId) => (dispatch, getState) => (
    new Promise((resolve) => {
        const { allAvailableSlots } = getState().staff;
        const month = startDate.month();
        const year = startDate.year();
        if (!alreadyFetched(allAvailableSlots, resourceId, year, month)) {
            const formattedStartDate = startDate.format('YYYY-MM-DD');
            const formattedEndDate = startDate.endOf('month').format('YYYY-MM-DD');
            request.get(
                urls.slots(formattedStartDate, formattedEndDate, resourceId)
            ).then((response) => {
                const resource = response.body;
                const slots = resource.length ? keyOffDate(resource[0].available_slots) : {};
                dispatch({
                    type: SLOTS_FETCHED,
                    id: resourceId,
                    month,
                    year,
                    availableSlots: slots,
                    dayPickerMonth: startDate.toDate(),
                    fetchedDate: startDate
                });
                resolve();
            });
        } else
            dispatch({
                type: SLOTS_FETCHED,
                id: resourceId,
                month,
                year,
                availableSlots: allAvailableSlots[resourceId][year][month],
                dayPickerMonth: startDate.endOf('month').toDate(),
                fetchedDate: startDate
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

export const fetchStaff = () =>
    dispatch => new Promise((resolve) => {
        request.get('/api/service').then((response) => {
            const staffMembers = [];
            const resourceIds = response.body.resources;
            const duration = response.body.duration;
            const promises = resourceIds.map(resourceId => (
                    request.get(`/api/resources/${resourceId}`).then((resourcesResponse) => {
                        const { id, name } = resourcesResponse.body;
                        staffMembers.push({ id: id.toString(), name, imagePath: images[name] });
                    })
                ));
            Promise.all(promises).then(() => (
                    dispatch({
                        type: STAFF_FETCHED,
                        staffMembers,
                        duration
                    })
                ));
        });
        resolve();
    });

export default fetchStaff;
