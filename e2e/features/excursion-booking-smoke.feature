@smoke-excursion-booking
Feature: Dev domain Atlántico REST booking
  The site lists excursions from the supplier JSON API
  and can confirm a booking through POST /confirm/.

  # Creates a real supplier reservation, then cancels it.
  # Run against https://tenerifejoy.com or https://tenerife-tour.vercel.app

  Scenario: Book a Teide tour and receive a booking code
    Given I open the dev English tours catalog
    When I open the Coach Tours category
    And I open the Teide Half Day tour
    Then the Atlántico booking form should offer a date
    When I submit a smoke-test excursion booking
    Then the excursion booking should be confirmed
    And the smoke-test booking should be cancelled
