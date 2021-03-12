const CanalModel = require('../model/canal.model');
const {error, success} = require('../helper/util');
const MSG = require('../constants/responseMessages.json');

class CanalController {
    constructor() {
        const canal = new CanalModel();
        this.model = canal.getModel();
    }

    getAll(req, res, next) {
        this.model.find({}, {_id: 0, id: 1, canal: 1}, (err, result) => {
            if (err) {
                return error(res, err.message)
            }
            success(res, result);
        })
    }

    get(req, res, next) {
        const id = req.params.id;

        if (isNaN(Number(id))) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        this.model.findOne({id}, {_id: 0, __v: 0}, (err, result) => {
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

    async post(req, res, next) {
        const {canal} = req.body;

        if (!canal) {
            return error(res, null, MSG.CHANNEL_NOT_INFORMED);
        }

        if (await this.model.exists({canal})) {
            return error(res, null, MSG.CHANNEL_EXISTS);
        }

        this.model.create({canal: canal.toLowerCase()}, (err, result) => {
            if (err) {
                error(res, err.message, MSG.NOT_CREATE_CHANNEL, 400);
            } else {
                const {id, canal} = result;
                success(res, {id, canal}, MSG.INSERT_CHANNEL, 201);
            }
        });
    }

    async put(req, res, next) {
        const {canal} = req.body;
        const id = req.params.id;

        if (!canal) {
            return error(res, null, MSG.CHANNEL_NOT_INFORMED);
        }

        this.model.update({id}, (err, result) => {
            if (err) {
                return error(res, err.message, MSG.NOT_UPDATE_CONTATO, 400);
            }

            if (result.nModified === 1) {
                success(res, null, MSG.UPDATED_CONTACT,204);
            } else {
                error(res, null, MSG.NOT_FOUND,404);
            }
        });
    }

    delete(req, res, next) {
        const id = req.params.id;

        if (isNaN(Number(id))) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        this.model.remove({id}, (err, result) => {
            if (err) {
                return error(res, err.message, MSG.PROCESS_ERROR, 400);
            }

            if (result.deletedCount === 1) {
                success(res, {}, MSG.CHANNEL_DELETED);
            } else {
                error(res, null, MSG.NOT_FOUND, 404);
            }

        });
    }

    async setInitialChannels() {
        const channels = ['email', 'celular', 'fixo'];

        for (let channel of channels) {
            try {
                if (!(await this.model.exists({canal: channel}))) {
                    await this.model.create({canal: channel});
                    console.log(`Canal ${channel} criado!`);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}

module.exports = CanalController;
