module.exports = (err, req, res, next) => {
    if (err.name === 'TypeError') { err.status = 400; }
    if (err.name === 'MongoError') { console.log(err.message);
    
        err.message = 'OPPS! some error is occured!'; }

    return res.status(err.status || 500).send({
        "result": "error",
        "message": err.message,
        "status": err.status
    });
};