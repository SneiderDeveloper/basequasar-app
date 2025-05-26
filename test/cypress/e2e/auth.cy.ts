describe('Auth', () => {
    it('Login', () => {
        cy.visit('/#/passenger/work-orders/index');
        cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com');
        cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');
        cy.get('.q-btn').click();
    }) 
})