const {Schema, model} = require('mongoose');
const {randomBytes, createHmac} = require('crypto');
const HashModel = require('./hash.model');

class UsuarioModel {
    constructor() {
        const hashModel = new HashModel();
        this.modelHash = hashModel.getModel();

        this.structure = new Schema({
            id: Number,
            usuario: String,
            senha: String,
            isAuthorized: {
                type: Boolean,
                default: false
            }
        });

        let that = this;
        this.structure.pre('save', function(next) {
            that.preSaveData(this, next);
        });

        this.model = this.checkModel('Usuario');
    }

    async preSaveData(current, next) {
        const query = await this.model.findOne({}, ['id'], {sort: {id: -1}})
        const obj = this.generateHash(current.senha, this.generateSalt());
        const saltSave = await this.modelHash.create({userId: current._id, salt: obj.salt});

        if (saltSave) {
            current.senha = obj.hash;
            current.id = !query ? 1 : (query.id + 1);
            next();
        }
    }

    checkModel(name) {
        try {
            return model(name, this.structure);
        } catch (e) {
            return model(name);
        }
    }

    getModel() {
        return this.model;
    }

    generateSalt(size = 16) {
        return randomBytes(size).toString('hex');
    }

    generateHash(senha, salt) {
        const hash = createHmac('sha512', salt);
        hash.update(senha);
        return {
            salt,
            hash: hash.digest('hex')
        }
    }

    async userIsValid(user, password) {
        const usuario = await this.model.findOne({usuario: user});
        const objSalt = await this.modelHash.findOne({userId: usuario._id});

        if (usuario && objSalt) {
            const objHash = this.generateHash(password, objSalt.salt);

            if (objHash.hash === usuario.senha) {
                return { isValid: true, id : usuario.id, user: usuario.usuario, isAuthorized: usuario.isAuthorized };
            } else {
                return { isValid: false, user: null, id: null, isAuthorized: false };
            }

        } else {
            return { isValid: false, user: null, id: null, isAuthorized: false };
        }
    }
}

module.exports = UsuarioModel;
