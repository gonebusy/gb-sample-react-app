const formatMonth = (date) => {
    const month = date.month() + 1;
    return month < 10 ? `0${month}` : month;
};

// date is a moment object
export const getYYYYMMPath = (date) => {
    const formattedMonth = formatMonth(date);
    return `${date.year()}/${formattedMonth}`;
};

// date is a moment object
export const getYYYYMMDDPath = (date) => {
    const formattedMonth = formatMonth(date);
    return `${date.year()}/${formattedMonth}/${date.date()}`;
};

export default getYYYYMMPath;
