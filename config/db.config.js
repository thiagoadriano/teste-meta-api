const {DATABASE} = require('../constants/env.json');

class DbConnect {
    constructor() {
        this.mongoose = require('mongoose');
        this.URI = `mongodb://${DATABASE.URL}:${DATABASE.PORT}/${DATABASE.COLLECTION}`;
        this.options = { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
    }

    connect() {
        this.mongoose.connect(this.URI, this.options, this.callbackConnect);
        this.mongoose.connection.on('error', this.callbackConnect);
    }

    callbackConnect(error) {
        if (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = DbConnect;
