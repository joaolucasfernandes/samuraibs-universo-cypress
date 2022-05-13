
//import faker from '@faker-js/faker'

import signup from '../support/pages/signup'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    //const email = faker.internet.email()  //geração de email dinâmico

    context('quando o usuário é novato', function () {
        const user = {
            name: 'Rone Mendes',
            email: 'ronemendes@yahoo.com.br',
            password: 'amanha'
        }

        before(function () {
            // removendo o usuário para que a massa seja sempre válida
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

            //cy.intercept('POST', '/users', { //ouvinte
            //    statusCode: 200
            //}).as('postUser') //interceptando o erro 400 e simulando um 200. Isso pode não funcionar para aplicações comuns

            //cy.wait('@postUser') //esperando a invocação da api
        })

    })

    context('quando o email já existe', function () {
        const user = {
            name: 'Ana Julia',
            email: 'ana@yahoo.com.br',
            password: 'amanha',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)  //remove o usuário a cada novo teste
                .then(function (result) {
                    console.log(result)
                })

            cy.request(  //pre cadastro atraves da api e verificar se o retorno desse cadastro direto na api, retornou 200
                'POST',  //isso deixará o teste independente
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('não deve cadastrar o usuário', function () {  //only = roda somente essa funcionalidade
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email é incorreto', function () {
        const user = {
            name: 'Alvaro Henrique',
            email: 'alvaro.yahoo.com.br',
            password: 'amanha',
        }

        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {  //executa uma vez para cada it do contexto ou describe
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar com a senha: ' + p, function () {
                const user = { name: 'Jason Friday', email: 'jason@gmail.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
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
                signupPage.alertHaveText(alert)
            })
        })
    })

})

