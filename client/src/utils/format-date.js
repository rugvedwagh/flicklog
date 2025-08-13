import moment from "moment";

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month 
    const dd = String(date.getDate()).padStart(2, "0");       // Day
    const yyyy = date.getFullYear();                          // Year

    return `${dd}-${mm}-${yyyy}`;
};

const formatPostedDate = (date) => {
    if (!date) return "Unknown date"
    return moment(date).format("MMMM D, YYYY")
}

export {
    formatDate,
    formatPostedDate
};