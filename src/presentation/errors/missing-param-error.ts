export class MissingParamError extends Error {


    constructor(paramName: String) {
        super(`Missing param ${paramName}`)
    }
}