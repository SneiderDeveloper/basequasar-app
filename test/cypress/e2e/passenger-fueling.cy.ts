Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false previene que Cypress falle el test
  return false;
});


describe('Passenger fueling', () => {
    beforeEach(() => {
        cy.visit('/#/ramp/fueling/index');
        cy.wait(10000);
        cy.get('body').then(($body) => {
            if ($body.find('.q-form > :nth-child(1)').length > 0) {
                cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com')
                cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');          
                cy.get('.q-btn').click();
            }
        });
    });

    // it('Testing visibility of quickFilter type actions and filters', () => {
    //     cy.contains('Fueling New', { timeout: 15000 }).should('be.visible');
    //     cy.get('input[placeholder="Search"]').should('be.visible');
    //     cy.contains('button', 'New').should('be.visible');
    //     cy.get('#filter-button-crud').should('be.visible');
    //     cy.get('#refresh-button-crud').should('be.visible');
    //     cy.get('label').contains('Customer').should('be.visible');
    //     cy.get('label').contains('Contract').should('be.visible');
    //     cy.get('label').contains('Status').should('be.visible');
    //     cy.get('label').contains('Ad Hoc').should('be.visible');

    //     const fields = [
    //         'ID',
    //         'Customer',
    //         'Contracts',
    //         'Ticket Number',
    //         'Registration Number',
    //         'Status',
    //         'Station',
    //         'Responsible',
    //         'Service date',
    //         'Created At',
    //         'Updated At',
    //         'Actions'
    //     ];

    //     fields.forEach(field => {
    //         cy.get('th, td').contains(field).should('be.visible');
    //     });
    // })
    
    it('Testing to create a "Work Order" in fueling', () => {
        cy.contains('button', 'New').click();
        cy.get('input[aria-label="*Customer/Contract"]').click();
        cy.get('[role="option"]', { timeout: 10000 }).first().click();

        cy.get('label').contains('*Fueling ticket number').parent().find('input').as('ticketInput');
        cy.get('@ticketInput').click().clear().type('TEST-00');

        cy.get('input[aria-label="Responsible"]').type('ima');
        cy.get('[role="option"]', { timeout: 10000 }).contains('Imagina Colombia').click();
        

        cy.get('label').contains('*Station').parent().find('input').click();
        cy.get('[role="option"]', { timeout: 10000 }).first().click();

        cy.get('button').contains('Save').click();

        cy.get('#masterModalContent')
            .contains('Update fueling')
            .should('be.visible', { timeout: 15000 });
    })

    it('Testing updating a "Work Order" in fueling', () => {
        cy.get('tbody .q-tr.tw-bg-white').first().find('button').eq(1).click();
        cy.contains('a', 'Edit').click();

        cy.get('input[aria-label="*Customer/Contract"]').click();
        cy.get('[role="option"]', { timeout: 10000 }).first().click();

        cy.get('#masterModalContent div').contains('Update fueling Id:').first().click();

        cy.get('input[aria-label="*A/C Type"]').click();
        cy.get('[role="option"]', { timeout: 10000 }).first().click();

        cy.get('input[aria-label="*Carrier"]').click();
        cy.get('[role="option"]', { timeout: 10000 }).eq(2).click();

        cy.get('#masterModalContent div').contains('Update fueling Id:').first().click();

        cy.get('label').contains('Aircraft Registration').parent().find('input').click().clear().type('545218');

        cy.get('#stepComponent').contains('Services').click();
        cy.get('ul').contains('Services').click();
        cy.get('.tw-flex > div:nth-child(3) > .q-btn').first().click();
        cy.get('div:nth-child(2) > div > div > #dynamicFieldComponent > div > .tw-flex > div:nth-child(3) > .q-btn').first().click();
        // cy.get('section button').eq(1).find('button').should('be.visible');

        cy.get('#stepComponent').contains('Remark').click();

        cy.get('label').contains('Remark').parent().find('input,textarea').click().clear().type('Message test');
        cy.get('label').contains('Safety Message').parent().find('input,textarea').click().clear().type('Message test');

        cy.contains('button', 'Close Flight').click();
        cy.contains('Update fueling Id:').should('not.exist');
        cy.contains('Record updated').should('be.visible');
    })

    it('Testing to delete a "Work Order" in fueling', () => {
        cy.get('tbody .q-tr.tw-bg-white', { timeout: 60000 }).first().as('row');
        cy.get('@row').should('be.visible');

        // Obtener el texto de la celda (id)
        cy.get('@row').find('td').eq(2).invoke('text').then((id) => {
            // Click en el segundo botón dentro de la fila
            cy.get('@row').find('button').eq(1).click();

            // Click en el enlace "Delete"
            cy.get('a').contains('Delete').click();

            cy.get('button').contains('Cancel').should('be.visible');
            cy.contains('Are you sure, you want to').should('be.visible');
            cy.get('button').contains('Delete').should('be.visible');
            cy.get('button').contains('Delete').click();

            cy.contains('Record NOT deleted').should('not.exist');
            cy.get('table', { timeout: 60000 }).should('not.contain', id.trim());
        });
    })
})