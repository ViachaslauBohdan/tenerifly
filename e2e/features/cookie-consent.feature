Feature: Cookie consent banner
  As a visitor
  I want to accept, reject, or withdraw advertising cookies
  So the site does not measure ads before I choose

  @cookie-consent
  Scenario: Accepting cookies can be reviewed again on the next visit
    Given I open the English home page for cookie consent
    Then the cookie consent banner should be visible
    And the Google ads tag should not be loaded
    When I accept cookies
    Then the cookie consent banner should be hidden
    And the Google ads tag should be loaded
    And cookie settings should be available
    When I reload the page
    Then the cookie consent banner should be visible
    And the Google ads tag should be loaded

  @cookie-consent
  Scenario: Rejecting cookies keeps the ads tag off and the banner returns
    Given I open the English home page for cookie consent
    When I reject cookies
    Then the cookie consent banner should be hidden
    And the Google ads tag should not be loaded
    When I reload the page
    Then the cookie consent banner should be visible
    And the Google ads tag should not be loaded

  @cookie-consent
  Scenario: A visitor can withdraw consent from cookie settings
    Given I open the English home page for cookie consent
    When I accept cookies
    And I open cookie settings
    Then the cookie consent banner should be visible
    When I reject cookies
    And I reload the page
    Then the cookie consent banner should be visible
    And the Google ads tag should not be loaded
