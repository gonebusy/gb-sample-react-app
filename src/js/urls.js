export const slots = (start, end, id) => (
    `/api/slots?startDate=${start}&endDate=${end}&resourceId=${id}`
);

export default slots;
