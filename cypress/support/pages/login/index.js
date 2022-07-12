
import { el } from './elements'
import toast from '../../components/toast'
import alert from '../../components/alert'

class LoginPage {

    constructor(){      //dentro do construtor, criamos o objeto qe tera acesso ao componente
        this.toast = toast
        this.alert = alert
    }

    go() {
        cy.visit('/')

        //checkpoint garantindo que esta na pagina certa
        cy.contains(el.title)
            .should('be.visible')
    }

    form(user) {
        cy.get(el.email)
            .clear()
            .type(user.email)
        cy.get(el.password)
            .clear()
            .type(user.password)
    }

    submit() {
        cy.contains(el.signIn)
            .click()
    }

    
}

export default new LoginPage()