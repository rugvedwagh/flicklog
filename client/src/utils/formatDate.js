const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month (0-based)
    const dd = String(date.getDate()).padStart(2, "0");       // Day
    const yyyy = date.getFullYear();                          // Year

    return `${dd}-${mm}-${yyyy}`;
};

export default formatDate;