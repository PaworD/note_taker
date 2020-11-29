function verifyToken(req, res, next) {
    //Get Header Authorization value
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];

        //Assign Toen to Request
        req.token = bearerToken;

        next()
    } else {
        //Forbidden..
        res.sendStatus(403);
    }
}

module.exports = {
    verifyToken
}