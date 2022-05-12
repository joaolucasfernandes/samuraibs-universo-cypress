
import { el } from './elements'

class Toast {
    shouldHaveText(expectText) {
        cy.get(el.toast) //toast = caixinha com a mensagem de confirmação ou erro
            .should('be.visible')
            .find('p')
            .should('have.text', expectText)
    }
}

export default new Toast()