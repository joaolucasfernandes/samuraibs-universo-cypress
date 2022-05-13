

it('webapp deve estar online', function(){
    //um simples comentário
    cy.visit('/')

    cy.title()  //obtem o titulo da pagina
        .should('eq', 'Samurai Barbershop by QAninja')
})
