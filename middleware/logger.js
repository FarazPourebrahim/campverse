//@desc     Logs request to console
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}:/${req.url} ${res.statusCode}`);
    next();
}

module.exports = logger;