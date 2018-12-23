exports.AppError = class ApplicationError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.result = "error"
        this.name = this.constructor.name;
        this.message = message || 'Error occured!';
        this.status = status || 500;
    }
};

exports.AppSuccess = class AppSuccess {
    constructor(data, message, code) {
        this.data = data || null;
        this.result = "success";
        this.message = message || "Operation successful";
        this.status = code || 200;
    }
};