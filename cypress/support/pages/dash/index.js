
import { el } from './elements'
import header from '../../components/header'

class DashPage {

    constructor() {
        this.header = header   //dashpage importa os elementos do cabeçalho
    }

    //função que valida se o calendário ta visivel
    calendarShouldBeVisible() {
        cy.get(el.calendar, { timeout: 7000 })
            .should('be.visible')
    }

    selectDay(appointmentDate) {

        let today = new Date()  //variavel para pegar o dia do sistema
        let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0) //pega o ultimo dia do mês

        if (today.getDate() === lastDayOfMonth.getDate()) { //se o dia da data de hoje é igual ao dia da ultima data do mes
            cy.log('Hoje é o último dia do mês')

            cy.get(el.nextMonthButton)
                .should('be.visible')
                .click()

            // Checkpoint para garantir que houve a troca do calendário
            let monthName
            switch (appointmentDate.getMonth()) {
                case 0:
                    monthName = 'Janeiro'
                    break
                case 1:
                    monthName = 'Fevereiro'
                    break
                case 2:
                    monthName = 'Março'
                    break
                case 3:
                    monthName = 'Abril'
                    break
                case 4:
                    monthName = 'Maio'
                    break
                case 5:
                    monthName = 'Junho'
                    break
                case 6:
                    monthName = 'Julho'
                    break
                case 7:
                    monthName = 'Agosto'
                    break
                case 8:
                    monthName = 'Setembro'
                    break
                case 9:
                    monthName = 'Outubro'
                    break
                case 10:
                    monthName = 'Novembro'
                    break
                case 11:
                    monthName = 'Dezembro'
                    break

            }


            cy.contains(el.monthYearName, monthName)
                .should('be.visible')

        } else {
            cy.log('Hoje não é o último dia do mês')
        }

        cy.log(today.toString())
        cy.log(lastDayOfMonth.toString())

        const target = new RegExp('^' + appointmentDate.getDate() + '$', 'g')  //expressão regular para garantir que vai clicar no dia certo
        cy.contains(el.boxDay, target)
            .click({ force: true })  //force:true garante que vai clicar
    }

    appointmentShouldBe(customer, hour) {
        cy.contains('div', customer.name, { timeout: 10000 })  //busca uma div combinando com o texto da massa
            .should('be.visible')
            .parent()   //pega o elemento pai
            .contains(el.boxHour, hour)
            .should('be.visible')
    }

}

export default new DashPage()