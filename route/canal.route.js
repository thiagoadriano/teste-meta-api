const CanalController = require('../controller/canal.controller');

class CanalRouter {
    constructor(app) {
        this.controller = new CanalController();
        this.app = app;
        this.config();
    }

    config() {
        this.app.get('/canais', this.controller.getAll.bind(this.controller));
        this.app.get('/canal/:id', this.controller.get.bind(this.controller));
        this.app.post('/canal', this.controller.post.bind(this.controller));
        this.app.put('/canal/:id', this.controller.put.bind(this.controller));
        this.app.delete('/canal/:id', this.controller.delete.bind(this.controller));
    }
}

module.exports = CanalRouter;
