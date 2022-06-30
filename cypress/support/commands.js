// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import moment from 'moment'

import { apiServer } from '../../cypress.json'

import loginPage from './pages/login'
import dashPage from './pages/dash'

//App Actions
Cypress.Commands.add('uiLogin', function(user){
    loginPage.go()
    loginPage.form(user)
    loginPage.submit()
    dashPage.header.userLoggedIn(user.name)    //verifica se o usuario foi logado
})

Cypress.Commands.add('postUser', function (user) {  //apaga no banco e cadastra novamente através da api
    cy.task('removeUser', user.email)  //remove o usuário a cada novo teste
        .then(function (result) {
            console.log(result)
        })

    cy.request({  //pre cadastro atraves da api e verificar se o retorno desse cadastro direto na api, retornou 200
        method: 'POST',  //isso deixará o teste independente
        url: apiServer + '/users',
        body: user
    }).then(function (response) {
        expect(response.status).to.eq(200)
    })
})


Cypress.Commands.add('recoveryPass', function (email) { //recuperaçao de senha

    cy.request({  //pre cadastro atraves da api e verificar se o retorno desse cadastro direto na api, retornou 200
        method: 'POST',  //isso deixará o teste independente
        url: apiServer + '/password/forgot',
        body: { email: email }
    }).then(function (response) {
        expect(response.status).to.eq(204)

        cy.task('findToken', email)
            .then(function (result) {
                //console.log(result.token)
                Cypress.env('recoveryToken', result.token)
            })
    })

})


Cypress.Commands.add('createAppointment', function (hour) {

    let now = new Date() //variável com a data de hoje
    now.setDate(now.getDate() + 1)  //variavel recebe a data de hoje mais um

    Cypress.env('appointmentDate', now) //disponibiliza a informação para o teste la em cima. Variavel de ambiente. Pega somente o dia

    const date = moment(now).format(`YYYY-MM-DD ${hour}:00`) //interpolação de string


    const payload = {
        provider_id: Cypress.env('providerId'),  //passando variavel de ambiente
        date: date                              //recebe a constante com a data formatada
    }

    cy.request({       //requisição para criar o agendamento
        method: 'POST',
        url: apiServer + '/appointments', // `${apiServer}/appointments`, //interpolação
        body: payload,
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {   //callback
        expect(response.status).to.eq(200)
    })

})


Cypress.Commands.add('setProviderId', function (providerEmail) {

    cy.request({
        method: 'GET',
        url: apiServer + '/providers',
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
        console.log(response.body)

        const providerList = response.body

        //loop para percorrer a lista de prestadores de serviço
        providerList.forEach(function (provider) {
            if (provider.email === providerEmail) {   //o email desse provider que estou percorrendo na lista é igual ao providerEmail que estou recebendo como argumento. É o email do Ramon
                Cypress.env('providerId', provider.id)  //só pega o id de quem for Ramon Valdez
            }
        })

    })

})

Cypress.Commands.add('apiLogin', function (user, setLocalStorage = false) {

    const payload = {
        email: user.email,
        password: user.password
    }

    cy.request({       //mandar uma requisição post para a api do SamuraiBS
        method: 'POST',
        url: apiServer + '/sessions',
        body: payload
    }).then(function (response) {   //callback
        expect(response.status).to.eq(200)
        Cypress.env('apiToken', response.body.token)         //criando variável de ambiente e armazenando o token nela

        if(setLocalStorage){ //se true
            const {token, user } = response.body                //pegar o token e os dados de usuario do response

            window.localStorage.setItem('@Samurai:token', token)
            window.localStorage.setItem('@Samurai:user', JSON.stringify(user))
        }
       

    })

    if(setLocalStorage) cy.visit('/dashboard')
}) 