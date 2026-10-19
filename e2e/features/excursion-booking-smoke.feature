@smoke-excursion-booking
Feature: Dev domain Atlántico REST booking
  The site lists excursions from the supplier JSON API
  and sends the customer to card payment through POST /payment/.

  # Opens the supplier payment page. It does not enter card details.
  # Run against https://tenerifejoy.com or https://tenerife-tour.vercel.app

  Scenario: Book a Teide tour and open card payment
    Given I open the dev English tours catalog
    When I open the Coach Tours category
    And I open the Teide Half Day tour
    Then the Atlántico booking form should offer a date
    When I submit a smoke-test excursion booking
    Then the excursion booking should open card payment
