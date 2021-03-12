const AuthController = require('../controller/autenticacao.controller');

class AuthRouter {
    constructor(app) {
        this.authController = new AuthController();
        this.app = app;
        this.config();
    }

    config() {
        this.app.use(this.authController.validateAuth.bind(this.authController));
        this.app.get('/login', this.authController.login.bind(this.authController));
    }
}

module.exports = AuthRouter;
