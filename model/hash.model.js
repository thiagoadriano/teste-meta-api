const {Schema, model} = require('mongoose');

class HashModel {
    constructor() {
        this.structure = new Schema({
            salt: String,
            userId: String,
        });

        this.model = this.checkModel('Hash');
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

module.exports = HashModel;
