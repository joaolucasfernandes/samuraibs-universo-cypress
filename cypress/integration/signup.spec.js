
//import faker from '@faker-js/faker'

import signup from '../support/pages/signup'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    before(function(){  //chamando o arquivo json da pasta fixtures
        cy.fixture('signup').then(function(signup){
            this.success = signup.success
            this.email_dup = signup.email_dup
            this.email_inv = signup.email_inv
            this.short_password = signup.short_password
        })
    })
    //const email = faker.internet.email()  //geração de email dinâmico

    context('quando o usuário é novato', function () {
        before(function () {
            // removendo o usuário para que a massa seja sempre válida
            cy.task('removeUser', this.success.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {
            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

            //cy.intercept('POST', '/users', { //ouvinte
            //    statusCode: 200
            //}).as('postUser') //interceptando o erro 400 e simulando um 200. Isso pode não funcionar para aplicações comuns

            //cy.wait('@postUser') //esperando a invocação da api
        })

    })

    context('quando o email já existe', function () {
        before(function () {
            cy.postUser(this.email_dup)  ///função está no arquivo coomands.js
        })

        it('não deve cadastrar o usuário', function () {  //only = roda somente essa funcionalidade
            signupPage.go()
            signupPage.form(this.email_dup)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email é incorreto', function () {
      
        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(this.email_inv)
            signupPage.submit()
            signupPage.alert.haveText('Informe um email válido')
        })
    })

    context('quando a senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {  //executa uma vez para cada it do contexto ou describe
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar com a senha: ' + p, function () {
                
                this.short_password.password = p

                signupPage.form(this.short_password)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alert.haveText('Pelo menos 6 caracteres')
        })

    })

    context('quando nao preencho nenhum dos campos', function(){
        
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){    //execução do contexto
            signupPage.go()
            signupPage.submit()
        })  

        alertMessages.forEach(function(alert){

            it('deve exibir ' + alert.toLowerCase(), function(){
                signupPage.alert.haveText(alert)
            })
        })
    })

})

