const logger = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const timeTaken = Date.now() - startTime;

        console.log(
            `${req.method} ${req.originalUrl} - ${timeTaken}ms`
        );
    });

    next();
};

module.exports = logger;