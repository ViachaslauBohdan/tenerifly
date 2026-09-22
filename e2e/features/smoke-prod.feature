@smoke-prod
Feature: Production smoke against tenerifejoy.com
  As a maintainer
  I want safe click-through checks on the live site
  So deploy regressions are caught without sending real bookings

  # Never click Send / Book confirmation that posts forms or creates bookings.

  Scenario: Production home and excursions section load
    Given I open the production English home page
    Then the home hero section should be visible
    When I open the Tours section from the header
    Then the excursions section should be in view
    And the excursions section should show an Atlántico catalog surface

  Scenario: Production tours catalog is reachable
    Given I open the production English home page
    When I open the tours catalog page
    Then the page URL should include "/en/tours"
    And the tours catalog should show an Atlántico catalog surface

  Scenario: Production apartment pre-booking modal keeps Send visible on mobile
    Given I open a production Russian apartment detail page
    When I open the apartment pre-booking modal
    Then the pre-booking send button should be visible in the action bar
    And I must not submit the pre-booking form

  Scenario: Production apartment detail offers manager WhatsApp next to price check
    Given I open a production Russian apartment detail page
    Then the apartment contact-manager WhatsApp link should point to the work number
