const jwt = require('jsonwebtoken');
const MSG = require('../constants/responseMessages.json');
const {SECRET_KEY} = require('../constants/env.json');
const UsuarioModel = require('../model/usuario.model');

class AuthController {
    constructor() {
        this.userModel = new UsuarioModel();
    }

    validateAuth(req, res, next) {
       return next();
       const auth = req.header('authorization');
       const isLogin = req.originalUrl === '/login';
       let isAuth = false;
       let msgError = MSG.NOT_AUTORIZATION;

        if (!auth || !(auth.startsWith('Bearer') || auth.startsWith('Basic'))) {
            res.status(401).json({description: MSG.AUTH_NOT_PATTERN});
            return;
        }

        const authToken = auth.split(' ')[1];
       
       try {
           jwt.verify(authToken, SECRET_KEY);
           isAuth = true;
       } catch(e) {
           isAuth = false;
           if (e.name === 'TokenExpiredError') {
               msgError = MSG.TOKEN_EXPIRED;
           } else if (e.name === 'JsonWebTokenError') {
               msgError = MSG.TOKEN_INVALID;
           }
       }

        if ((auth && isAuth) || isLogin) {
            next();
        } else {
            res.status(401).json({description: msgError});
        }
    }
 
    async login(req, res, next) {
        const auth = req.header('authorization');

        if (!auth || !auth.startsWith('Basic')) {
            res.status(401).json({description: MSG.PASS_USER_ERROR});
            return;
        }

        const encriptedUser = auth.split(' ')[1];
        const [usuario, senha] = Buffer.from(encriptedUser, 'base64').toString('ascii').split(':');
        const {isValid, id, user, isAuthorized} = await this.userModel.userIsValid(usuario, senha);

        if (isValid && isAuthorized) {
            const expiresIn = 300;
            const token = jwt.sign({id, user}, SECRET_KEY, {expiresIn});
            process.env.userLogged = {id, user};
            res.status(200).json({token, expires_in: expiresIn, type: 'Bearer'});
        } else {
            res.status(401).json({description: MSG.PASS_USER_ERROR});
        }
    }
}

module.exports = AuthController;
