const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-")         // spaces to dashes
        .replace(/-+/g, "-");         // collapse multiple dashes
};

export { generateSlug };