
export function validateEmail(email: string) : boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export interface ValidationPasswordInterface {
    all: boolean,
    lettersStatus: boolean,
    lowercaseStatus: boolean,
    uppercaseStatus: boolean,
    numbersStatus: boolean,
    specailStatus: boolean,
    lengthStatus: boolean,
}

export function validatePassword(password: string) {
    const regex = {
        all: /^(?=.*\d)(?=.*[!@#$%^-_;'~+-/\`&*(),.?":{}|<>])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        letters: /^(?=.*[a-z])(?=.*[A-Z]).*$/,
        lowercase: /^(?=.*[a-z]).*$/,
        uppercase: /^(?=.*[A-Z]).*$/,
        numbers: /^(?=.*\d).*$/,
        specail: /^(?=.*[!@#$%^-_;'~+-/\`&*(),.?":{}|<>]).*$/,
    }
    const result = {
        all: regex.all.test(password),
        lettersStatus: regex.letters.test(password),
        lowercaseStatus: regex.lowercase.test(password),
        uppercaseStatus: regex.uppercase.test(password),
        numbersStatus: regex.numbers.test(password),
        specailStatus: regex.specail.test(password),
        lengthStatus: password.length >= 8
    }
    return result
}