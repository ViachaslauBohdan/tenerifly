Feature: Hero search full input section
  As a traveler on a mobile phone
  I want the whole search field to open its picker
  So I can change leisure type, guests, body type, and language easily

  Background:
    Given I open the home page on Android Chrome
    And the hero search section is visible

  Scenario: Leisure and guests fields are fully clickable without chevrons
    Then the "hero-leisure" field should be a full-width labeled select
    And the "hero-guests" field should be a full-width labeled select
    And the hero search should not show chevron icons
    When I tap the label of the "hero-guests" field
    And I choose "5" in the "hero-guests" select
    Then the "hero-guests" select value should be "5"

  Scenario: Car body type is fully clickable and date fields have no border
    When I choose "cars" in the "hero-leisure" select
    Then the "hero-car-body-type" field should be a full-width labeled select
    And the hero date inputs should have no border

  Scenario: Tour people and language fields are fully clickable
    When I choose "tours" in the "hero-leisure" select
    Then the "hero-people" field should be a full-width labeled select
    And the "hero-tour-language" field should be a full-width labeled select
    When I tap the label of the "hero-tour-language" field
    And I choose another option in the "hero-tour-language" select
    Then the "hero-tour-language" select value should have changed

  Scenario: Opening guests picker does not scroll the page to the bottom
    When I remember the page scroll position
    And I tap the label of the "hero-guests" field
    Then the guest count listbox should be visible
    And the page should not have scrolled to the bottom
    When I choose "8" in the "hero-guests" select
    Then the "hero-guests" select value should be "8"
    And the page should not have scrolled to the bottom

  Scenario: Opening tour people picker does not scroll the page to the bottom
    When I choose "tours" in the "hero-leisure" select
    And I remember the page scroll position
    And I tap the label of the "hero-people" field
    Then the guest count listbox should be visible
    And the page should not have scrolled to the bottom
    When I choose "15" in the "hero-people" select
    Then the "hero-people" select value should be "15"
    And the page should not have scrolled to the bottom
