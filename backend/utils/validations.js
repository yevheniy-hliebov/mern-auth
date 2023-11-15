const validateEmail = (email) => {
    if (typeof email !== 'string') {
        return false;
    }

    if (!/^[^@]*@[^@]*$/.test(email)) return false

    const [prefix, domain] = email.split('@');
    if (/^[0-9]+([-_.][0-9]+)*$/.test(prefix)) return false
    if (!/^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+)*$/.test(prefix)) return false
    if (!/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/.test(domain)) return false

    return true
}

function validateName(name) {
    if (typeof name !== 'string') {
        return { valid: false, message: "Name should be a string" };
    }

    if (name.trim().length === 0 || name.length > 50 || name === null) {
        return { valid: false, message: 'Name length should be between 1 and 50 characters' };
    }

    if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(name)) {
        return { valid: false, message: 'Name should contain only letters and spaces between words' };
    }
    return { valid: true };
}

const validatePassword = (password) => {
    if (typeof password !== 'string') {
        return {
            have6Characters: false,
            capitalLetter: false,
            lowercase: false,
            number: false,
            underscore: false,
            withoutSpace: true
        };
    }
    const validPassword = {
        have6Characters: password.length >= 6,
        capitalLetter: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        underscore: /_/.test(password),
        withoutSpace: !/\s/.test(password)
    }
    if (validPassword.have6Characters && validPassword.capitalLetter && validPassword.lowercase && validPassword.number && validPassword.underscore && validPassword.underscore)
        validPassword.valid = true
    else validPassword.valid = false
    return validPassword
}

module.exports = {
    validateEmail,
    validateName,
    validatePassword
}