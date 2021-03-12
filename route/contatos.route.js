const ContatoController = require('../controller/contato.controller');

class ContatoRouter {
    constructor(app) {
        this.controller = new ContatoController();
        this.app = app;
        this.config();
    }

    config() {
        this.app.get('/contatos', this.controller.getAll.bind(this.controller));
        this.app.get('/contato/:id', this.controller.get.bind(this.controller));
        this.app.post('/contato', this.controller.post.bind(this.controller));
        this.app.put('/contato/:id', this.controller.put.bind(this.controller));
        this.app.delete('/contato/:id', this.controller.delete.bind(this.controller));
    }
}

module.exports = ContatoRouter;
