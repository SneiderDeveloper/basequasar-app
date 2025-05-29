// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    cy.wait(9000);
    cy.get('body').then(($body) => {
        if ($body.find('.q-form > :nth-child(1)').length > 0) {
            cy.get('.q-form > :nth-child(1)').type('soporte@imaginacolombia.com')
            cy.get('.q-form > :nth-child(2)').type('ZAQxsw123@');          
            cy.get('.q-btn').click();
        }
    });
})

Cypress.Commands.add("selectStation", () => {
    // Seleccionar la estación
    cy.contains('label', 'Station').click();
    cy.get('[role="option"]', { timeout: 10000 }).first().click();
    cy.get('button').contains('filters').should('be.visible');
    cy.get('button').contains('filters').click();
})

Cypress.Commands.add("openFullModal", (filterName) => {
    cy.get(':nth-child(1) > .text-right > .crudIndexActionsColumn > .q-btn').click();
    cy.get('a').contains('Edit').click();
})

Cypress.Commands.add("deleteWorkOrder", () => {
    // Proceso de eliminación
    cy.get('a').contains('Delete').click();
    cy.get('button').contains('Cancel').should('be.visible');
    cy.contains('Are you sure, you want to').should('be.visible');
    cy.get('button').contains('Delete').should('be.visible');
    cy.get('button').contains('Delete').click();

    // Verificar que el registro no muestre mensaje de no eliminado
    cy.contains('Record NOT deleted').should('not.exist');
})

// DO NOT REMOVE
// Imports Quasar Cypress AE predefined commands
import { registerCommands } from '@quasar/quasar-app-extension-testing-e2e-cypress';
registerCommands();
