const {Schema, model} = require('mongoose');

class ContatoModel {
    constructor() {
        this.structure = new Schema({
            nome: String,
            canal: {
                type: Schema.Types.ObjectID,
                ref: 'Canal'
            },
            valor: String,
            obs: String,
            atualizado_em: Date,
            id: {
                unique: true,
                type: Number
            },
            criado_em: {
                default: Date.now,
                type: Date
            }
        });

        let that = this;
        this.structure.pre('save', function(next) {
            that.preSaveData(this, next);
        });

        this.model = this.checkModel('Contato');
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

    async preSaveData(current, next) {
        const query = await this.model.findOne({}, ['id'], {sort: {id: -1}})
        current.id = !query ? 1 : (query.id + 1);
        next();
    }
}

module.exports = ContatoModel;
