Feature: CMS description follows selected language
  As a visitor switching site language
  I want car descriptions in my language when CMS has them
  And apartment UI labels localized even if CMS body is still English

  Scenario: Ukrainian car detail shows localized description body
    Given I open the cars catalog on "ua"
    When I open the first car detail from the catalog
    Then the detail description heading should be "Опис"
    And the detail description body should contain Cyrillic text

  Scenario: Russian car detail shows localized description body
    Given I open the cars catalog on "ru"
    When I open the first car detail from the catalog
    Then the detail description heading should be "Описание"
    And the detail description body should contain Cyrillic text

  Scenario: Ukrainian apartment detail localizes the description label
    Given I open the apartments catalog on "ua"
    When I open the first apartment detail from the catalog
    Then the detail description heading should be "Опис"
    And the detail description body should not be empty
