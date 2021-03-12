const tipos = {
    celular: /^\d{2}9[6-9]\d{3}\d{4}$/,
    fixo: /^\d{2}[2-5]\d{3}\d{4}$/,
    email: /^[a-z._-]+@[a-z]+\.[a-z]{2,4}(\.[a-z]{2,4})?$/,
    alpha: /^[A-z]+$/,
    number: /^\d+$/,
    alphaNumeric: /^[a-z0-9]+$/
};

function validate(type, value) {
    const pattern = tipos[type];
    const validateObj = {
        hasPattern: false,
        isValid: false
    };

    if (pattern) {
        validateObj.hasPattern = true;
        validateObj.isValid = pattern.test(value);
    }

    return validateObj;
}

module.exports = validate;
