import { createSession } from '../auth';
import { config } from '../config';

const URL = `${config.url}/ramp/work-orders/index`;

describe('Authenticate and verify page', () => {
	it('should authenticate and verify the page title is visible', () => {
		cy.visit(URL);

		// Simula la función `createSession` de Playwright
		createSession();

		// Recarga la página
		cy.reload();

		// Verifica que el elemento con id `#titleCrudTable` sea visible
		cy.get('#titleCrudTable', { timeout: 25000 }).should('be.visible');
	});
});