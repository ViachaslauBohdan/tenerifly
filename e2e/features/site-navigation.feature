Feature: Site navigation for home and tours
  As a traveler
  I want header and tours links to land on the right sections
  So I can move between the homepage and the excursions catalog

  @site-nav
  Scenario: Home header Tours link scrolls to the excursions section
    Given I open the English home page for navigation
    When I open the Tours section from the header
    Then the excursions section should be in view
    And the excursions section should show an Atlántico catalog surface

  @site-nav
  Scenario: Tours catalog page is reachable with the locale prefix
    Given I open the English home page for navigation
    When I open the tours catalog page
    Then the page URL should include "/en/tours"
    And the tours catalog should show an Atlántico catalog surface

  @site-nav
  Scenario: Tours catalog Home link returns to the locale homepage
    Given I open the English tours catalog for navigation
    When I open Home from the header
    Then the page URL should be the English homepage
    And the home hero section should be visible

  @site-nav
  Scenario: Language switch keeps the tours path under the new locale
    Given I open the English tours catalog for navigation
    When I switch the header language to Spanish
    Then the page URL should include "/es/tours"
