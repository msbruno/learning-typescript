
describe("SignUp Controller", ()=> {

    test("Should return 4-- if no name is provided", () => {

        //sut = system under test.
        const sut = new SignUpController();
        const httpRequest = {
            body : {
                email: 'any@mail.com',
                password: 'password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    })
})