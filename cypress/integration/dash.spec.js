const { CopyResponse } = require("pg-protocol/dist/messages")

import dashPage from '../support/pages/dash'

import {customer, provider, appointment} from '../support/factories/dash'

describe('dashboard', function(){

    context('quando o cliente faz um agendamento no app mobile', function(){

        before(function(){ //implementação do contexto
            cy.postUser(provider)    //criação do usuario Ramon
            cy.postUser(customer)   //criamos o usuario Nikki Sixx
            
            cy.apiLogin(customer)    //fazendo login via api com Nikki
            cy.setProviderId(provider.email)  //setamos o identificador do Ramon Valdez
            cy.createAppointment(appointment.hour)       //criação do agendamento
        })

        it('o mesmo deve ser exibido no dashboard', function(){   //expectativa
            const date = Cypress.env('appointmentDate') //pega a data do agendamento

            //cy.uiLogin(provider)
            cy.apiLogin(provider, true) //login via api

            dashPage.calendarShouldBeVisible()  //aguarda até que o calendario esteja visivel
            dashPage.selectDay(date)
            dashPage.appointmentShouldBe(customer, appointment.hour)  //verifica se o nome do cliente e horario esta no dash
        })

    })
})

