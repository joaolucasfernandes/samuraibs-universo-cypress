
import { el } from './elements'
//timeouts explícitos
class Toast {
    shouldHaveText(expectText) {
        cy.get(el.toast) //toast = caixinha com a mensagem de confirmação ou erro
            .should('be.visible')
            .should('have.css', 'opacity', '1')
            .find('p')
            .should('have.text', expectText)
    }
}

export default new Toast()