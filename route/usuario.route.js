const UsuarioController = require('../controller/usuario.controller');

class UsuarioRouter {
    constructor(app) {
        this.controller = new UsuarioController();
        this.app = app;
        this.config();
    }

    config() {
        this.app.get('/usuarios', this.controller.getAll.bind(this.controller));
        this.app.get('/usuario/:id', this.controller.get.bind(this.controller));
        this.app.post('/usuario', this.controller.post.bind(this.controller));
        this.app.put('/usuario/:id', this.controller.put.bind(this.controller));
        this.app.delete('/usuario/:id', this.controller.delete.bind(this.controller));
    }
}

module.exports = UsuarioRouter;