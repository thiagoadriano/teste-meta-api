const {Schema, model} = require('mongoose');

class CanalModel {
    constructor() {
        this.structure = new Schema({
            id: {
                type: Number,
                unique: true
            },
            canal: String
        });

        let that = this;
        this.structure.pre('save', function(next) {
            that.updateId(this, next);
        });

        this.model = this.checkModel('Canal');
    }

    updateId(current, next) {
        this.model.findOne(
            {}, ['id'], {sort: {id: -1}},
            (error, register) => {
                if (error) return next(error, null);
                current.id = !register ? 1 : (register.id + 1);
                next();
            }
        );
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
}

module.exports = CanalModel;
