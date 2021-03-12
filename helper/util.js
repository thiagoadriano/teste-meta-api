const MSG = require('../constants/responseMessages.json');

function checkProps(listProps) {
    const returnItens = {};
    for (let item of listProps) {
        let [key, value] = item;
        if (value) {
            returnItens[key] = value;
        }
    }
    return returnItens;
}

function validateFields([key, value]) {
    const obj = {
        field: key
    };
    if (!value) {
        obj.message = MSG.FIELD_REQUIRED;
    }
    return obj;
}

function success(res, data = {}, desc, status = 200) {
    const objData = {data};
    if (desc) objData.description = desc;
    res.status(status).json(objData);
}

function error(res, error, desc = MSG.PROCESS_ERROR, status = 422) {
    const objReturn = { description: desc, data: null };
    if (error) objReturn.data = error;
    res.status(status).json(objReturn);
}

module.exports = {
    checkProps,
    validateFields,
    success,
    error
}
