import moment from 'moment';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false previene que Cypress falle el test
  return false;
});

describe('Ramp Schedule', () => {
    beforeEach(() => {
        cy.visit('/#/ramp/schedule/index');
        cy.wait(10000);
        cy.get('body').then(($body) => {
            if ($body.find('.q-form > :nth-child(1)').length > 0) {
                cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com')
                cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');          
                cy.get('.q-btn').click();
            }
        });
    });

    it('Testing the integrity of the station selection modal', () => {
        cy.get('#masterModalContent').should('be.visible', { timeout: 20000 });
        cy.contains('Filter schedule').should('be.visible');
        cy.contains('You must first select a').should('be.visible');
        cy.get('label').contains('Station').should('be.visible');

        cy.selectStation();

        cy.get('#masterModalContent').should('not.be.visible');
        cy.contains('Filter schedule').should('not.be.visible');
    })

    it('Testing that the modal requesting the station is triggered correctly', () => {
        cy.selectStation();

        cy.get('button').contains('Scheduler').click();
        cy.get('button').contains('Back to schedule').click();
        cy.contains('Filter schedule').should('not.be.visible');

        cy.get('[aria-label="Collapse \\"Ramp\\""]').click();
        cy.get('[aria-label="Expand \\"Ramp\\""]').click();
        cy.get('#menuItem-qrampadminworkOrders').click();
        cy.get('#menuItem-qrampadminschedule').click();
        cy.contains('Filter schedule').should('not.be.visible');

        cy.get('#menuItem-qrampadminpassengerOperationTypes').click();
        cy.get('#menuItem-qrampadminschedule').click();
        cy.contains('Filter schedule').should('not.be.visible');

        cy.get('[aria-label="Expand \\"Passenger\\""]').click();
        cy.get('#menuItem-qrampadminpassengerSchedule').click();
        cy.contains('Filter schedule').should('be.visible');
        cy.get('label').contains('Station').click();
        cy.get('input').filter(':visible').type('Austin, TX');
        cy.get('[role="option"]').contains('Austin, TX (AUS)').click();
        cy.get('button').contains('filters').click();

        cy.get('[aria-label="Expand \\"Ramp\\""]').click();
        cy.get('#menuItem-qrampadminschedule').click();
        cy.contains('Filter schedule').should('be.visible');
    })

    it('Testing the visibility of actions and titles in the "schedule"', () => {
        cy.get('[placeholder="Search"]').should('be.visible');
        cy.get('.actions-content > div > .q-btn').first().should('be.visible');
        cy.get('div:nth-child(3) > .q-btn').first().should('be.visible');
        cy.get('button').contains('Scheduler').should('be.visible');
        cy.get('#filter-button-crud').should('be.visible');
        cy.get('div:nth-child(6) > .q-btn').first().should('be.visible');

        cy.get('#pageActionscomponent').find('[aria-label="Expand"]').click();
        cy.contains('Refresh').should('be.visible');
        cy.contains('Refresh every 1 minutes').should('be.visible');
        cy.contains('Refresh every 5 minutes').should('be.visible');
        cy.contains('Refresh every 10 minutes').should('be.visible');
        cy.contains('Refresh every 15 minutes').should('be.visible');

        cy.get('button').contains('Week').should('be.visible');
        cy.get('button').contains('Today').should('be.visible');
        cy.get('a').contains('Schedule').should('be.visible');
    })

    it('Testing to create a "Work Order" in Schedule', () => {
        // Seleccionar la estación
        cy.contains('label', 'Station').click();
        cy.get('[role="option"]').first().click();
        cy.get('button').contains('filters').should('be.visible');
        cy.get('button').contains('filters').click();

        cy.get('.tw-inline-flex > button').first().click({ timeout: 10000 });
        cy.get('input[aria-label="*Flight number"]').clear().type('TEST-00');
        cy.get('[aria-label="*Operation"]').click().clear().type('Full_turn');
        cy.contains('Full_turn').click();

        cy.get('input[placeholder="HH:mm"]')
            .clear()
            .type(moment().format('HH:mm'));
        cy.get('input[placeholder="MM/DD/YYYY HH:mm"]')
            .clear()
            .type(moment().add(20, 'minute').format('MM/DD/YYYY HH:mm'));

        cy.get('[aria-label="Flight Status"]').click();
        cy.contains('[role="option"]', 'Arrived').click();

        cy.get('[aria-label="Aircraft types"]').click().clear().type('A20N');
        cy.contains('[role="option"]', 'A20N').find('div').eq(1).click();

        cy.get('.tw-border > .tw-space-x-2').find('button').eq(0).click();
        cy.contains('TEST-00/TEST-00').should('be.visible');
    });

    it('Testing updating a "Work Order" in Schedule', () => {
        cy.get('#kanban-card-actions').first().should('be.visible');
        cy.contains('TEST-00/TEST-00').first().click();

        cy.get('[data-testid="dynamicField-inboundFlightNumber"]').find('input').click();
        cy.get('[data-testid="dynamicField-inboundFlightNumber"]')
            .find('input')
            .clear()
            .type('TEST-01');
        cy.get('[data-testid="dynamicField-operationTypeId"]').find('input').click();
        cy.get('[aria-label="*Operation"]').clear().type('Half_turn_Inbound');
        cy.contains('[role="option"]', 'Half_turn_Inbound').click();

        cy.get('input[aria-label="Flight Status"]').click();
        cy.contains('[role="option"]', 'Scheduled').click();
        cy.get('input[aria-label="Aircraft types"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('.tw-border > .tw-space-x-2').find('button').eq(0).click();
        cy.contains('TEST-01').should('be.visible', { timeout: 15000 });
    })

    it('Testing to delete a "Work Order" in Schedule', () => {
        cy.get('[data-testid="kanbanDay"]')
            .find('div')
            .contains('TEST-01')
            .parentsUntil('[data-testid="kanbanDay"]')
            .find('#kanban-card-actions')
            .eq(3)
            .click()

        cy.get('#cardContent').contains('TEST-01').should('be.visible');
        cy.contains('Are you sure, you want to').should('be.visible');
        cy.contains('button', 'Cancel').should('be.visible');
        cy.contains('button', 'Delete').should('be.visible');
        cy.contains('button', 'Delete').click();
        cy.contains('Record NOT deleted', { timeout: 10000 }).should('not.exist');
    })
})