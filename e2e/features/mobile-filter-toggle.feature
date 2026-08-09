Feature: Mobile filter toggle on listing pages
  As a mobile user browsing cars or apartments
  I want filters to be hidden by default with a toggle button
  So I can quickly see listings without scrolling past filters

  Background:
    Given I open the home page on Android Chrome

  Scenario: Cars page shows mobile filter toggle button on mobile viewport
    When I navigate to the "/cars" page
    Then I should see a "Show filters" button with a filter icon
    And the filters should be hidden by default

  Scenario: Clicking the filter toggle button shows and hides filters on cars page
    When I navigate to the "/cars" page
    And I click the "Show filters" button
    Then the filters should become visible
    And the button text should change to "Hide filters"
    When I click the "Hide filters" button
    Then the filters should be hidden
    And the button text should change to "Show filters"

  Scenario: Apartments page shows mobile filter toggle button on mobile viewport
    When I navigate to the "/apartments" page
    Then I should see a "Show filters" button with a filter icon
    And the filters should be hidden by default

  Scenario: Clicking the filter toggle button shows and hides filters on apartments page
    When I navigate to the "/apartments" page
    And I click the "Show filters" button
    Then the filters should become visible
    And the button text should change to "Hide filters"
    When I click the "Hide filters" button
    Then the filters should be hidden
    And the button text should change to "Show filters"

  Scenario: Filter toggle button is not visible on desktop viewport
    When I set the viewport to desktop size
    And I navigate to the "/cars" page
    Then the "Show filters" button should not be visible
    And the filters should be visible by default

  Scenario: Filters remain functional after toggling on cars page
    When I navigate to the "/cars" page
    And I click the "Show filters" button
    And I apply a filter
    Then the car listings should update based on the filter
    And the applied filters should remain active after hiding filters

  Scenario: Filters remain functional after toggling on apartments page
    When I navigate to the "/apartments" page
    And I click the "Show filters" button
    And I apply a filter
    Then the apartment listings should update based on the filter
    And the applied filters should remain active after hiding filters

  Scenario: Mobile filter button appears above listings reducing scroll
    When I navigate to the "/cars" page
    Then the "Show filters" button should be positioned at the top
    And the car listings should be immediately visible below the button
    And I should not need to scroll to see the first car listing
