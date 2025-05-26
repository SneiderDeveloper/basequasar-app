Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false previene que Cypress falle el test
  return false;
});

import moment from 'moment';

const FORMAT_DATE = 'MM/DD/YYYY HH:mm';
const today = moment().format(FORMAT_DATE);
const tomorrow = moment().add(1, 'day').format(FORMAT_DATE);
const yesterday = moment().subtract(1, 'day').format(FORMAT_DATE);

describe('Passenger Work Order', () => {
    beforeEach(() => {
        cy.visit('/#/passenger/work-orders/index');
        cy.get('body').then(($body) => {
            if ($body.find('.q-form > :nth-child(1)').length) {
                cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com');
                cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');
                cy.get('.q-btn').click();
            }
            // Si no existe el campo, simplemente no hace nada y sigue el test
        });
    });

    it('Check visibility of fields in the creation modal and create a work order', () => {
        cy.wait(10000);

        cy.get('[data-testid="btn-dropdown-New-1"]').click();
        cy.contains('Create Flight').click();
        cy.contains('New Work Order').should('be.visible');
        cy.contains('*Customer').should('be.visible');
        cy.contains('*Flight number').should('be.visible');
        cy.contains('Enter the fight number and').should('be.visible');
        cy.contains('*Station').should('be.visible');
        cy.contains('Assigned to').should('be.visible');
        cy.contains('If you left this field empty').should('be.visible');
        cy.get('button').contains('Save').should('be.visible');

        cy.contains('*Customer').click();
        cy.get('input[aria-label="*Customer"]').type('AARK');
        cy.contains('.q-item', 'AARK (Ad Hoc)').click();
        cy.get('#formRampComponent div').contains('New Work Order').first().click();

        cy.contains('*Flight number').click();
        cy.get('input[aria-label="*Flight number"]').type('TEST-00');
        cy.contains('*Station').click();
        cy.get('input[aria-label="*Station"]').type('Austin');
        cy.contains('.q-item', 'Austin, TX (AUS)').click();
        cy.contains('Assigned to').click();
        cy.get('input[aria-label="Assigned to"]').type('ima');
        cy.contains('.q-item', 'Imagina Colombia').click();
        cy.get('button').contains('Save').click();

        cy.contains('Error when looking for the').should('not.exist');

        cy.contains('Flight number').should('be.visible');
        cy.contains('Are you sure TEST-00 is a').should('be.visible');
        cy.get('button').contains('Cancel').should('be.visible');
        cy.get('button').contains('Yes').should('be.visible');

        cy.get('button').contains('Yes').click();

        cy.contains('What do you want to do?').should('be.visible');
        cy.get('button').contains('Go out to the list').should('be.visible');
        cy.get('button').contains('Continue editing').should('be.visible');
        cy.get('button').contains('Create a new one').should('be.visible');

        cy.get('button').contains('Go out to the list').click();
    })

    it('Testing updating a "Work Order" in "Work Orders"', () => {
        cy.wait(10000);
        cy.get(':nth-child(1) > .text-right > .crudIndexActionsColumn > .q-btn').click();
        cy.get('a').contains('Edit').click();

        cy.contains('*Customer').should('be.visible');
        cy.contains('*Station').should('be.visible');
        cy.contains('*Carrier').should('be.visible');
        cy.contains('*Status').should('be.visible');

        cy.contains('*A/C Type').should('be.visible');
        cy.get('input[aria-label="*A/C Type"]').click();
        cy.get('.q-menu .q-item').eq(2).click(); // Ajusta el selector según tu menú de opciones
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        cy.contains('*Operation').should('be.visible');
        cy.get('input[aria-label="*Operation"]').click();

        // Selecciona y hace clic en la opción 3 (índice 2)
        cy.get('.q-menu .q-item').eq(2).should('be.visible').click();
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        // Charter Rate
        cy.get('input[aria-label="*Charter Rate"]').click().type('1000');

        // Cancellation type
        cy.contains('Cancellation type').should('be.visible');
        cy.get('input[aria-label="Cancellation type"]').click();
        cy.contains('.q-item', 'Cancelled Flight').click();
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        // Pax Operation
        // cy.contains('Pax Operation').should('be.visible');
        cy.get('input[aria-label="Pax Operation"]').click();
        cy.get('.q-menu .q-item').eq(1).click();
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        cy.get('div').contains('Cancellation Notice time').find('input[type="number"]').clear().type('24');

        cy.contains('Origin').should('be.visible');
        cy.get('input[aria-label="Origin"]').then($origin => {
            if ($origin.is(':hidden')) {
                cy.get('button').contains('Collapse').eq(1).click();
            }
            cy.wrap($origin).click();
        });

        cy.get('[role="option"]').eq(2).click();
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        cy.get('[data-testid="dynamicField-inboundTailNumber"] input[aria-label="Tail N°"]').click().type('45');

        cy.get('[data-testid="dynamicField-inboundScheduledArrival"] input[placeholder="MM/DD/YYYY HH:mm"]').click().type(today);

        cy.get('[role="combobox"][aria-label="Destination"]').click();
        cy.get('[role="option"]').eq(3).click();
        cy.get('#formRampComponent div').contains('Update Work Order Id:').first().click();

        cy.get('[data-testid="dynamicField-outboundTailNumber"] input[aria-label="Tail N°"]').click().type('45');

        cy.get('[data-testid="dynamicField-outboundScheduledDeparture"] input[placeholder="MM/DD/YYYY HH:mm"]').click().type(tomorrow);

        cy.get('input[aria-label="Inbound Gate Arrival"]').click().type('02');
        cy.get('input[aria-label="Outbound Gate Departure"]').click().type('04');

        cy.get('[data-testid="dynamicField-inboundBlockIn"] input').click().type(yesterday);
        cy.get('[data-testid="dynamicField-outboundBlockOut"] input').click().type(today);

        cy.contains('Difference (hours):').should('be.visible');

        // Section "Services"
        cy.get('#stepComponent').contains('Services').click();
        cy.contains('Cargo Man Power').click();
        cy.get('.tw-flex > div:nth-child(3) > .q-btn').first().click();
        cy.get('div:nth-child(2) > div > div > #dynamicFieldComponent > div > .tw-flex > div:nth-child(3) > .q-btn').first().click();
        cy.get('.q-px-sm > .fa-star').first().click();
        cy.get('div:nth-child(2) > .color-bg-blue-gray-custom > div > .q-px-sm > .fa-star').click();

        cy.get('body', { timeout: 10000 }).should(($body) => {
            const hasCreation = $body.text().includes('Favorite created successfully');
            const hasElimination = $body.text().includes('Favorite deleted successfully');
            expect(hasCreation || hasElimination).to.be.true;
        });

        // Section "Delay"
        cy.get('#stepComponent').contains('Delay').click();
        cy.get('input[aria-label="Our delay"]').click();
        cy.get('[role="option"]').contains('Yes').click();

        // Espera a que las alertas se oculten
        cy.contains('Favorite created successfully', { timeout: 10000 }).should('not.exist');
        cy.contains('Favorite deleted successfully', { timeout: 10000 }).should('not.exist');

        cy.get('textarea').click().type('Delay comment');
        cy.get('input[aria-label="Code"]').click();
        cy.get('[role="option"]').eq(1).click();
        cy.get('input[aria-label="Time"]').click().type('24');

        cy.get('[role="combobox"][aria-label="Flight type"]').click();
        cy.get('[role="option"]').first().click();

        // Section "Remark"
        cy.get('#stepComponent').contains('Remark').click();
        cy.get('textarea[aria-label="Remark"]').click().type('Testing');
        cy.get('textarea[aria-label="Safety Message"]').click().type('Testing');

        cy.get('button').contains('Close').click();

        cy.get('#formRampComponent', { timeout: 10000 }).should('not.exist');
        cy.contains('Record updated').should('be.visible');
    })

    it('Testing feature dalys', () => {
        cy.wait(10000);
        cy.get(':nth-child(1) > .text-right > .crudIndexActionsColumn > .q-btn').click();
        cy.get('a').contains('Edit').click();

        const dateBlockIn = moment().add(15, 'minutes').format(FORMAT_DATE);
        let dateBlockOut = moment().add(1, 'day').add(30, 'minutes').format(FORMAT_DATE);

        cy.get('[data-testid="dynamicField-outboundBlockOut"]')
            .find('input')
            .click()
            .clear()
            .type(dateBlockOut);

        cy.get('[data-testid="dynamicField-outboundScheduledDeparture"]')
            .find('input')
            .click()
            .clear()
            .type(tomorrow);

        cy.get('[data-testid="dynamicField-outboundBlockOut"]')
            .find('input')
            .click()
            .clear()
            .type(dateBlockOut);

        cy.get('[data-testid="dynamicField-outboundScheduledDeparture"]')
            .find('input')
            .click()
            .clear()
            .type(tomorrow);

        cy.get('button').contains('Close').click();
        cy.contains('You have to enter the at least one delay reason for the', { timeout: 15000 }).should('be.visible');

        cy.get('[data-testid="dynamicField-inboundBlockIn"]')
            .find('input')
            .click()
            .clear()
            .type(dateBlockIn);

        cy.get('[data-testid="dynamicField-inboundScheduledArrival"]')
            .find('input')
            .click()
            .clear()
            .type(today);

        cy.get('button').contains('Close').click();

        cy.contains('You have to enter the at least one delay reason for the', { timeout: 15000 }).should('be.visible');

        cy.get('[role="combobox"][aria-label="Code"]').first().click();
        cy.get('[role="option"]').first().click();

        cy.get('[role="combobox"][aria-label="Code"]').eq(1).click();
        cy.get('[role="option"]').eq(4).click();

        cy.get('button').contains('Close').click();

        cy.get('#formRampComponent', { timeout: 10000 }).should('not.exist');
        cy.contains('Record updated').should('be.visible');

        cy.get(':nth-child(1) > .text-right > .crudIndexActionsColumn > .q-btn').click();
        cy.get('a').contains('Edit').click();

        cy.get('[role="combobox"][aria-label="*Operation"]').should('be.visible').click();
        cy.get('[role="option"]').contains(/^TURN$/).click(); // ^ y $ aseguran coincidencia exacta

        cy.get('[role="combobox"][aria-label="Code"]').should('have.length', 1);

        dateBlockOut = moment().add(1, 'day').add(25, 'minutes').format(FORMAT_DATE);

        cy.get('[data-testid="dynamicField-outboundBlockOut"]')
            .find('input')
            .click()
            .clear()
            .type(dateBlockOut);

        cy.get('[data-testid="dynamicField-outboundScheduledDeparture"]')
            .find('input')
            .click()
            .clear()
            .type(tomorrow);

        cy.get('[role="combobox"][aria-label="Code"]', { timeout: 10000 }).should('not.exist');
    })

    it('Testing to delete a "Work Order" in "Work Orders"', () => {
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
});