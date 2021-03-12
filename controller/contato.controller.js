const ContatoModel = require('../model/contato.model');
const CanalModel = require('../model/canal.model');
const MSG = require('../constants/responseMessages.json');
const validate = require('../helper/validacoes');
const {
    checkProps,
    validateFields,
    success,
    error
} = require('../helper/util');

class ContatoController {
    constructor() {
        const contatoModel = new ContatoModel();
        const canalModel = new CanalModel();
        this.model = contatoModel.getModel();
        this.modelCanal = canalModel.getModel();
    }

    async getAll(req, res, next) {
        let size = req.query.size;
        let page = req.query.page;
        let skipper = 0;

        size = isNaN(Number(size)) ? 10 : Number(size);
        page = isNaN(Number(page)) ? 0 : Number(page);
        skipper = page * size;

        let totalRegisters = await this.model.countDocuments({});

        this.model.find({}, [], {sort: {id: 1}, limit: size, skip: skipper}).populate('canal').exec((err, result) => {
            if (err) {
                error(res, err.message);
            } else {
                let totalPages = Math.round(totalRegisters / size);
                const data = {
                    totalRegisters,
                    totalPages,
                    totalThisPage: result.length,
                    list: result.map(contato => this.schemaResponse(contato))
                };
                success(res, data);
            }
        });
    }

    get(req, res, next) {
        const id = req.params.id;

        if (isNaN(Number(id))) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        this.model.findOne({id}).populate('canal').exec((err, result) => {
            if (err) {
                return error(res, err.message, MSG.PROCESS_ERROR, 400);
            }

            if (result) {
                success(res, this.schemaResponse(result));
            } else {
                error(res, null, MSG.NOT_FOUND, 404);
            }
        });
    }

    async post(req, res, next) {
        const {nome, valor, obs, canal} = req.body;
        const validFields = Object.entries({nome, valor, canal})
                                .map(validateFields)
                                .filter(item => item.message);

        if (validFields.length) {
            return error(res, validFields, MSG.FIELDS_NOT_VALID);
        }

        const isValidValue = validate(canal.toLowerCase(), valor);
        const existCanal = await this.modelCanal.findOne({canal});

        if (!existCanal) {
            return error(res, null, MSG.NOT_FOUND_CHANNEL, 404);
        }

        if (isValidValue.hasPattern && !isValidValue.isValid) {
            const msgPattern = MSG[`PATTERN_${canal.toUpperCase()}`];
            return error(res, {canal, message: msgPattern}, MSG.VALUE_INVALID);
        }

        this.model.create({nome, valor, obs, canal: existCanal._id}, (err, result) => {
            if (err) {
                error(res, err.message, MSG.NOT_CREATE_CONTATO, 400);
            } else {
                success(res, this.schemaResponse(result), MSG.INSERT_CONTACT, 201);
            }
        });
    }

    async put(req, res, next) {
        const id = req.params.id;
        const {nome, valor, obs, canal} = req.body;
        const fieldsUpdate = checkProps(Object.entries({nome, valor, obs, canal}));

        if (isNaN(Number(id))) {
            return error(res, null, MSG.PARAM_INVALID);
        }

        if (!Object.keys(fieldsUpdate).length) {
            return error(res, null, MSG.NOT_FIELDS_UPDATE);
        }

        if (fieldsUpdate.canal) {
            const existCanal = await this.modelCanal.findOne({canal: fieldsUpdate.canal});
            if (!existCanal) {
                return error(res, null, MSG.NOT_FOUND_CHANNEL, 404);
            }
        }

        if (fieldsUpdate.valor) {
            let canal = null;

            if (fieldsUpdate.canal) {
                const channel = await this.modelCanal.findOne({canal: fieldsUpdate.canal}, ['_id']);
                canal = fieldsUpdate.canal;
                fieldsUpdate.canal = channel._id;
            } else {
                const currentContact = await this.model.findOne({id}).populate('canal').exec();
                canal = currentContact.canal.canal;
            }

            const isValidValue = validate(canal.toLowerCase(), valor);
            if (isValidValue.hasPattern && !isValidValue.isValid) {
                const msgPattern = MSG[`PATTERN_${canal.toUpperCase()}`];
                return error(res, {canal, message: msgPattern}, MSG.VALUE_INVALID);
            }
        }

        fieldsUpdate.atualizado_em = Date.now();
        this.model.update({id}, fieldsUpdate, (err, result) => {
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
                success(res, {}, MSG.USER_DELETED);
            } else {
                error(res, null, MSG.NOT_FOUND, 404);
            }

        });
    }

    schemaResponse(contato) {
        return {
            id: contato.id,
            nome: contato.nome,
            valor: contato.valor,
            canal: contato.canal.canal,
            obs: contato.obs || ''
        };
    }
}

module.exports = ContatoController;
