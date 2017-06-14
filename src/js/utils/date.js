export const formatMonth = month =>
    month < 10 ? `0${month}` : month;

// date is a moment object
export const getYYYYMMPath = (date) => {
    const formattedMonth = formatMonth(date.month() + 1);
    return `${date.year()}/${formattedMonth}`;
};

// date is a moment object
export const getYYYYMMDDPath = (date) => {
    const formattedMonth = formatMonth(date.month() + 1);
    return `${date.year()}/${formattedMonth}/${date.date()}`;
};

export default getYYYYMMPath;
