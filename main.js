const DbConnect = require('./config/db.config');
const CanalRouter = require('./route/canal.route');
const ContatoRouter = require('./route/contatos.route');
const AuthRouter = require('./route/autenticacao.route');
const UsuarioRouter = require('./route/usuario.route');
const UsuarioController = require('./controller/usuario.controller');
const CanalController = require('./controller/canal.controller');
const App = require('./config/app.config');

const app = new App();
const db = new DbConnect();

const userController = new UsuarioController();
const canalController = new CanalController();

new AuthRouter(app.getApp());
new ContatoRouter(app.getApp());
new UsuarioRouter(app.getApp());
new CanalRouter(app.getApp());

db.connect();

userController.setAdminUser();
canalController.setInitialChannels();

app.startServer();
