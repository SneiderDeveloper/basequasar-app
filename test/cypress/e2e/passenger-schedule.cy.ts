import moment from 'moment';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false previene que Cypress falle el test
  return false;
});

describe('Passenger Schedule', () => {

    beforeEach(() => {
        cy.visit('/#/passenger/schedule/index');
        cy.login();
    });

    it('Testing the station selection modal in the "schedule"', () => {
        cy.get('#masterModalContent', { timeout: 20000 }).should('be.visible');
        cy.contains('Filter schedule').should('be.visible');
        cy.contains('You must first select a').should('be.visible');
        cy.get('input[aria-label="Station"]').should('be.visible');

        // Seleccionar la estación
        cy.selectStation();

        cy.get('#masterModalContent').should('not.exist');
        cy.contains('Filter schedule').should('not.exist');
    })

    it('Testing that the modal requesting the station is triggered correctly', () => {
        cy.get('button').contains('Scheduler').click();
        cy.get('button').contains('Back to schedule').click();
        cy.contains('Filter schedule').should('not.exist');

        cy.visit('/#/passenger/work-orders/index');
        
        cy.visit('/#/passenger/schedule/index');
        cy.contains('Filter schedule').should('not.exist');
        
        cy.visit('/#/passenger/operation-types/index');
        cy.visit('/#/passenger/schedule/index');
        cy.contains('Filter schedule').should('not.exist');
        
        cy.visit('/#/ramp/schedule/index');
        cy.contains('label', 'Station').click();
        cy.get('[role="option"]', { timeout: 10000 }).contains('Chicago (ORD)').click();
        cy.get('button').contains('filters').click();

        cy.visit('/#/passenger/schedule/index');
        cy.contains('Filter schedule').should('be.visible');
    })

    it('Testing the visibility of actions and titles in the "schedule"', () => {
        cy.get('input[placeholder="Search"]').should('be.visible');
        cy.get('.actions-content > div > .q-btn').first().should('be.visible');
        cy.get('div:nth-child(3) > .q-btn').first().should('be.visible');
        cy.get('button').contains('Scheduler').should('be.visible');
        cy.get('#filter-button-crud').should('be.visible');
        cy.get('div:nth-child(6) > .q-btn').first().should('be.visible');

        cy.get('div:nth-child(6) > .q-btn').first().click();
        cy.contains('Refresh').should('be.visible');
        cy.contains('Refresh every 1 minutes').should('be.visible');
        cy.contains('Refresh every 5 minutes').should('be.visible');
        cy.contains('Refresh every 10 minutes').should('be.visible');
        cy.contains('Refresh every 15 minutes').should('be.visible');

        cy.get('button').contains('Week').should('be.visible');
        cy.get('button').contains('Today').should('be.visible');
        cy.get('a').contains('Schedule').should('be.visible');
    })

    it('Testing changes from day to week and from week to day', () => {
        // checkTheSwitchToTheWeeklyView
        cy.get('button').contains('Week').click();
        cy.get('button').contains('Today').should('be.visible');
        cy.get('button').contains('Week').should('not.exist');
        cy.get('.tw-inline-flex').first().should('be.visible');
        cy.get('.tw-flex-1 > div:nth-child(2) > div > div:nth-child(2) > div')
            .should('be.visible');

        // checkTheSwitchToTheDailyView
        cy.get('button').contains('Today').click();
        cy.get('button').contains('Week').should('be.visible');
        cy.get('button').contains('Today').should('be.visible');
        cy.get('.tw-inline-flex').first().should('be.visible');
        cy.get('.tw-flex-1 > div:nth-child(2) > div > div:nth-child(2) > div')
            .should('not.exist');
    })

    it('Testing to create a "Work Order" in Schedule', () => {
        cy.get('.tw-inline-flex > .q-btn-dropdown').click({ timeout: 10000 });
        cy.get('.q-list > :nth-child(1)').click();
        cy.get('input[aria-label="*Flight number"]').clear().type('TEST-00');

        cy.get('input[aria-label="*Operation"]').click();
        cy.get('[role="option"]').eq(4).click();

        cy.get('input[aria-label="STD"]')
            .clear()
            .type(moment().add(20, 'minute').format('MM/DD/YYYY HH:mm'));

        cy.get('input[aria-label="STA"]')
            .clear()
            .type(moment().format('HH:mm'));

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

        cy.get('form').find('.q-expansion-item.q-expansion-item--standard').then($item => {
            if ($item.first().hasClass('q-expansion-item--collapsed')) {
                cy.wrap($item.first()).find('.q-expansion-item__container').click();
            }
            if ($item.eq(1).hasClass('q-expansion-item--collapsed')) {
                cy.wrap($item.eq(1)).find('.q-expansion-item__container').click();
            }
        });

        cy.get('[data-testid="dynamicField-inboundFlightNumber"]').clear().type('TEST-01');
        cy.get('[data-testid="dynamicField-outboundFlightNumber"]').clear().type('TEST-01');

        cy.get('input[aria-label="Origin"]').clear().type('acadiana');
        cy.get('[role="option"]').contains('Acadiana Rgnl (ARA)').click();

        cy.get('[data-testid="dynamicField-inboundTailNumber"]')
            .find('input')
            .clear({ force: true, timeout: 10000 })
            .type('78');

        cy.get('input[aria-label="Inbound Gate Arrival"]').clear().type('18');

        cy.get('input[aria-label="Destination"]').clear().type('Almaty');
        cy.get('[role="option"]').contains('Almaty (ALA)').click();

        cy.contains('Update Work Order Id:').click();

        cy.get('[data-testid="dynamicField-outboundTailNumber"]')
            .find('input')
            .click()
            .clear()
            .type('78');

        cy.get('input[aria-label="Outbound Gate Departure"]').clear().type('19');

        cy.get('#stepComponent').contains('Services').click();
        cy.contains('Cargo Man Power').click();
        cy.get('.fa-star').first().click();
        cy.get('.tw-flex > div:nth-child(3) > .q-btn').first().click();
        cy.get('div:nth-child(2) > div > div > #dynamicFieldComponent > div > .tw-flex > div:nth-child(3) > .q-btn').first().click();

        cy.get('#stepComponent').contains('Delay').click();
        cy.get('input[aria-label="Our delay"]').click();
        cy.get('[role="option"]').contains('Yes').click();

        cy.get('textarea').clear().type('Delay comment');
        cy.get('input[aria-label="Code"]').click();
        cy.get('[role="option"]').eq(1).click();
        cy.get('input[aria-label="Time"]').clear().type('24');

        cy.get('[role="combobox"][aria-label="Flight type"]').click();
        cy.get('[role="option"]').first().click();

        cy.get('#stepComponent').contains('Remark').click();
        cy.get('textarea[aria-label="Remark"]').clear().type('Message');
        cy.get('textarea[aria-label="Safety Message"]').clear().type('Message');

        cy.get('button').contains('Close').click();
        cy.get('#innerLoadingMaster div', { timeout: 10000 }).should('not.exist');

        cy.contains('TEST-01').last().should('be.visible');
        cy.contains('Record updated').should('be.visible');
    })

    it('Testing to delete a "Work Order" in Schedule', () => {
        cy.get('[data-testid="kanbanDay"]')
            .find('div')
            .contains('TEST-01/TEST-01')
            .parentsUntil('[data-testid="kanbanDay"]')
            .find('#kanban-card-actions')
            .eq(2)
            .click();

        cy.get('#cardContent').contains('TEST-01').should('be.visible');
        cy.contains('Are you sure, you want to').should('be.visible');
        cy.get('button').contains('Cancel').should('be.visible');
        cy.get('button').contains('Delete').should('be.visible');
        cy.get('button').contains('Delete').click();

        cy.contains('Record NOT deleted').should('not.exist');
    })

    it('Testing the schedule filters', () => {
        cy.get('#filter-button-crud').click();
        cy.contains('Filters').should('be.visible');
        cy.get('button').contains('Day').should('be.visible');
        cy.get('.q-date__view').first().should('be.visible');
        cy.get('input[aria-label="Filter by time"]').should('be.visible');
        cy.get('input[aria-label="Customer"]').should('be.visible');
        cy.get('input[aria-label="Carrier"]').should('be.visible');
        cy.get('input[aria-label="Station"]').should('be.visible');
        cy.get('input[aria-label="Status"]').should('be.visible');
        cy.get('input[aria-label="Operation type"]').should('be.visible');
        cy.get('input[aria-label="Flight Status"]').should('be.visible');
        cy.get('input[aria-label="Ad Hoc"]').should('be.visible');
        cy.get('button').contains('Search').should('be.visible');

        cy.get('.q-drawer__content > div > i').click();
        cy.contains('Filters').should('not.exist');
    })

    it('Testing the sheduler view actions', () => {
        cy.get('button').contains('Scheduler').click();
        cy.get('#titleCrudTable').should('be.visible');
        cy.get('button').contains('Back to schedule').should('be.visible');
        cy.get('button').contains('New').should('be.visible');
        cy.get('#crudIndexViewAction').should('be.visible');
        cy.get('#filter-button-crud').should('be.visible');
        cy.get('#refresh-button-crud').should('be.visible');
        cy.get('input[aria-label="Customer"]').should('be.visible');
        cy.get('button').contains('Filters:').should('be.visible');
    })

    it('Testing create a Scheduler', () => {
        cy.get('button').contains('Scheduler').click();
        cy.get('button').contains('New').click();
        cy.contains('New Scheduler').should('be.visible');

        cy.get('input[aria-label="*Customer/Contract"]').click();
        cy.get('[role="option"]').first().click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="Airlines"]').click();
        cy.get('[role="option"]').first().click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="Station"]').click();
        cy.get('[role="option"]').first().click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="Aircraft types"]').click();
        cy.get('[role="option"]').first().click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="*Operation"]').click();
        cy.get('[role="option"]').first().click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="* From Date"]').click().clear().type(moment().format('MM/DD/YYYY'));
        cy.get('input[aria-label="* Until Date"]').click().clear().type(moment().add(1, 'day').format('MM/DD/YYYY'));

        cy.get('input[aria-label="Days Of Week"]').click();
        cy.get('[role="option"]').contains('Friday').click();
        cy.get('[role="option"]').contains('Monday').click();
        cy.get('[role="option"]').contains('Saturday').click();
        cy.get('#masterModalContent div').contains('New Scheduler').first().click();

        cy.get('input[aria-label="*Flight number"]').click().clear().type('TEST-02');
        cy.get('input[aria-label="* Inbound Schedule Arrival"]').click().clear().type(moment().format('HH:mm'));
        cy.get('input[aria-label="*Outbound Flight Number"]').click().clear().type('547');
        cy.get('input[aria-label="*Outbound Schedule Departure"]').click().clear().type(moment().add(1, 'hour').format('HH:mm'));
        cy.get('input[aria-label="Dep. +Days"]').click().clear().type('7');

        cy.get('button').contains('Save').click();
        cy.get('#masterModalContent #innerLoadingMaster circle').should('be.visible');
        cy.get('#masterModalContent #innerLoadingMaster circle', { timeout: 10000 }).should('not.exist');
        cy.get('#masterModalContent div').contains('New Scheduler').first().should('not.exist');
    })

    it('Testing updating a scheduler', () => {
        cy.get('button').contains('Scheduler').click();

        // Open modal
        cy.get('tbody').find('.q-tr.tw-bg-white').first().find('button').click();
        cy.get('a').contains('Edit').click();

        cy.contains('Update scheduler Id:').should('be.visible');

        cy.get('input[aria-label="Airlines"]').click().clear().type('canada');
        cy.get('[role="option"]').contains('Air Canada').click();
        cy.get('#masterModalContent div').contains('Update scheduler Id:').first().click();

        cy.get('input[aria-label="Aircraft types"]').click().clear().type('74N');
        cy.get('[role="option"]').contains('74N').click();
        cy.get('#masterModalContent div').contains('Update scheduler Id:').first().click();

        cy.get('input[aria-label="*Flight number"]').click().clear().type('TEST-03');
        cy.get('input[aria-label="*Inbound Schedule Arrival"]')
            .clear()
            .type(moment().add(20, 'minutes').format('HH:mm'));
        cy.get('input[aria-label="*Outbound Flight Number"]').click().clear().type('850');
        cy.get('input[aria-label="*Outbound Schedule Departure"]')
            .click()
            .clear()
            .type(moment().add(2, 'hour').format('HH:mm'));
        cy.get('input[aria-label="Dep. +Days"]').click().clear().type('8');

        cy.get('button').contains('Save').click();
        cy.get('#masterModalContent #innerLoadingMaster circle').should('be.visible');
        cy.get('#masterModalContent #innerLoadingMaster circle', { timeout: 10000 }).should('not.exist');
        cy.get('#masterModalContent div').contains('Update scheduler Id:').first().should('not.exist');
    })

    it('Testing the removal of a Scheduler', () => {
        cy.get('button').contains('Scheduler').click();

        cy.get('tbody').find('.q-tr.tw-bg-white').first().as('firstRow');
        cy.get('@firstRow').should('be.visible');

        cy.get('@firstRow').find('td').eq(0).invoke('text').then((id) => {
            cy.get('@firstRow').find('button').click();

            cy.get('a').contains('Delete').click();
            cy.get('button').contains('Cancel').should('be.visible');
            cy.contains('Are you sure, you want to').should('be.visible');
            cy.get('button').contains('Delete').should('be.visible');
            cy.get('button').contains('Delete').click();

            cy.contains('Record NOT deleted').should('not.exist');
            cy.get('table').contains(id, { timeout: 60000 }).should('not.exist');
        });
    })
})