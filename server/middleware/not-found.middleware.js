const notFound = (req, res, next) => {
    res.status(404).json({
        message: "Route not found",     // Only for wrong backend route, not frontend
    });
};

export default notFound;
