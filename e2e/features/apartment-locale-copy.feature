Feature: Localized apartment copy on home and catalog
  As a visitor on the Polish site
  I want listing-type labels in Polish
  So the UI locale matches the selected language

  Scenario: Polish catalog shows localized listing type
    Given I open the apartments catalog on "pl"
    Then I should see the listing type "Na wynajem"
