import moment from 'moment';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false previene que Cypress falle el test
  return false;
});

describe('Passenger Schedule', () => {

    beforeEach(() => {
        cy.visit('/#/passenger/schedule/index');
        cy.wait(10000);
        cy.get('body').then(($body) => {
            if ($body.find('.q-form > :nth-child(1)').length > 0) {
                cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com')
                cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');          
                cy.get('.q-btn').click();
            }
        });
    });

    it('Testing to create a "Work Order" in Schedule', () => {
        // Seleccionar la estación
        cy.contains('label', 'Station').click();
        cy.get('[role="option"]').first().click();
        cy.get('button').contains('filters').should('be.visible');
        cy.get('button').contains('filters').click();

        cy.get('.tw-inline-flex > .q-btn-dropdown').click({ timeout: 10000 });
        cy.get('.q-list > :nth-child(1)').click();
        cy.get('input[aria-label="*Flight number"]').clear().type('TEST-00');

        cy.get('input[aria-label="*Operation"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('input[aria-label="STD"]').clear().type(moment().format('HH:mm'));

        cy.get('input[placeholder="MM/DD/YYYY HH:mm"]')
            .clear()
            .type(moment().add(20, 'minute').format('MM/DD/YYYY HH:mm'));

        cy.get('input[aria-label="Flight Status"]').click();
        cy.get('[role="option"]').contains('Departed').click();

        cy.get('input[aria-label="Aircraft types"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('.tw-border > .tw-space-x-2').find('button').eq(0).click();

        cy.contains('TEST-00/TEST-00').last().should('be.visible');
    })

    it('Testing updating a "Work Order" in Schedule', () => {
        cy.contains('TEST-00/TEST-').last().click();

        cy.get('input[aria-label="*Customer"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('input[aria-label="Cancellation type"]').click();
        cy.get('[role="option"]').contains('Cancelled Flight').click();

        cy.get('input[aria-label="*A/C Type"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('input[aria-label="*Cancellation Notice time entered in Hours"]').click().clear().type('51');

        cy.get('input[aria-label="*Flight number"]').first().click().clear().type('TEST-01');
        cy.get('input[aria-label="*Flight number"]').eq(2).click().clear().type('TEST-01');

        cy.get('input[aria-label="Origin"]').click().clear().type('acadiana');
        cy.get('[role="option"]').contains('Acadiana Rgnl (ARA)').click();

        cy.get('[data-testid="dynamicField-inboundTailNumber"] input[aria-label="Tail N°"]').click().clear().type('78');

        cy.get('input[aria-label="Inbound Gate Arrival"]').click().clear().type('18');

        cy.get('input[aria-label="Destination"]').click().clear().type('Almaty');
        cy.get('[role="option"]').contains('Almaty (ALA)').click();

        cy.contains('Update Work Order Id:').click();

        cy.get('[data-testid="dynamicField-outboundTailNumber"] input[aria-label="Tail N°"]').click().clear().type('78');

        cy.get('input[aria-label="Outbound Gate Departure"]').click().clear().type('19');

        cy.get('#stepComponent').contains('Services').click();
        cy.contains('Cargo Man Power').click();
        cy.get('.fa-star').first().click();
        cy.get('.tw-flex > div:nth-child(3) > .q-btn').first().click();
        cy.get('div:nth-child(2) > div > div > #dynamicFieldComponent > div > .tw-flex > div:nth-child(3) > .q-btn').first().click();

        cy.get('#stepComponent').contains('Delay').click();
        cy.get('input[aria-label="Our delay"]').click();
        cy.get('[role="option"]').contains('Yes').click();

        cy.get('input[aria-label="Delay Comment"]').click().clear().type('4');

        cy.get('input[aria-label="Code"]').click();
        cy.get('[role="option"]').eq(4).click();

        cy.get('input[aria-label="Time"]').first().click().clear().type('24');

        cy.get('#stepComponent').contains('Remark').click();
        cy.get('input[aria-label="Remark"]').click().clear().type('Message');
        cy.get('input[aria-label="Safety Message"]').clear().type('Message');

        cy.get('button').contains('Close').click();
        cy.get('#innerLoadingMaster div', { timeout: 10000 }).should('not.be.visible');

        cy.contains('TEST-01').last().should('be.visible');
        cy.contains('Record updated').should('be.visible');
    })
})