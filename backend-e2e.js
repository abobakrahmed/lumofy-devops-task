// cypress/e2e/myapp.spec.js
describe('MyApp E2E Tests', () => {
    beforeEach(() => {
      cy.visit('http://frontend.example.com'); // URL of the frontend
    });
  
    it('loads the homepage', () => {
      cy.contains('Welcome to MyApp Frontend');
    });
  
    it('fetches data from the backend', () => {
      cy.intercept('GET', '/api/data').as('getData');
      cy.visit('http://frontend.example.com');
  
      cy.wait('@getData').its('response.statusCode').should('eq', 200);
      cy.get('#data').should('contain', 'Expected data from backend');
    });
  
    it('handles form submission', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome, testuser');
    });
  });
  