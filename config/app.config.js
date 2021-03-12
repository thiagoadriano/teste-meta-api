const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const {PORT} = require('./constants/env');


class App {
    constructor() {
        this.USE_PORT = process.env.PORT || PORT;
        this.app = express();
        this.setSecurity();
        this.setConfig();
        this.generalRoute();
    }

    setConfig() {
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
    }

    setSecurity() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.disable('x-powered-by');
    }

    getApp() {
        return this.app;
    }

    generalRoute() {
        this.app.get('*', this.routeError.bind(this));
        this.app.post('*', this.routeError.bind(this));
        this.app.put('*', this.routeError.bind(this));
        this.app.delete('*', this.routeError.bind(this));
    }

    routeError(req, res, next) {
        res.status().json({});
    }

    startServer() {
        this.app.listen(this.USE_PORT, () => {
            console.log(`Aplication initialized in localhost:${this.USE_PORT}`);
        });
    }
}

module.exports = App;
