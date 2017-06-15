export const fromMilitaryTime = (time) => {
    const colonIndex = time.indexOf(':');
    const hour = parseInt(time.slice(0, colonIndex), 10);
    const minutes = time.slice(colonIndex + 1);
    if (hour > 12)
        return `${hour - 12}:${minutes} PM`;
    return `${hour}:${minutes} AM`;

};

export default fromMilitaryTime;
