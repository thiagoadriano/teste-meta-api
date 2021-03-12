const UsuarioModel = require('../model/usuario.model');
const {ADMIN_USER} = require('../constants/env.json');
const {error, success} = require('../helper/util');
const MSG = require('../constants/responseMessages.json');

class UsuarioController {
    constructor() {
        const usuarioModel = new UsuarioModel();
        this.model = usuarioModel.getModel();
    }

    getAll(req, res, next) {
        this.model.find({}, ['isAuthorized', 'usuario'], (err, result) => {
           if (err) {
               return error(res, err.message);
           }
           success(res, result);
        });
    }

    get(req, res, next) {
        const id = req.params.id;

        if (!this.isValidID(id)) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        this.model.findOne({_id: id}, ['isAuthorized', 'usuario'], (err, result) => {
            if (err) {
                return error(res, err.message, MSG.PROCESS_ERROR, 400);
            }
            if (result) {
                success(res, result);
            } else {
                error(res, null, MSG.NOT_FOUND, 404);
            }
        });
    }

    post(req, res, next) {}

    put(req, res, next) {}

    delete(req, res, next) {
        const id = req.params.id;

        if (!this.isValidID(id)) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        this.model.remove({_id: id}, (err, result) => {
            if (err) {
                return error(res, err.message, MSG.PROCESS_ERROR, 400);
            }

            if (result.deletedCount === 1) {
                success(res, {}, MSG.USER_DELETED);
            } else {
                error(res, null, MSG.NOT_FOUND, 404);
            }

        });
    }

    isValidID(id) {
        return /[a-z0-9]+/i.test(id);
    }

    async setAdminUser() {
        if (!(await this.model.exists({usuario: ADMIN_USER.NAME}))) {
            const objUser = {
                usuario: ADMIN_USER.NAME,
                senha: ADMIN_USER.PASSWORD,
                isAuthorized: true
            };
            this.model.create(objUser, (error, usuario) => {
                if (error) throw new Error(error.message);
                console.log('Usuario do sistema criado!');
            });
        }
    }
}

module.exports = UsuarioController;
