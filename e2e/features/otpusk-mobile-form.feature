@iphone
Feature: World tours Otpusk search on iPhone
  As a traveler booking a package tour on a phone
  I want Country, From, and dates stacked inside the blue Tour search card
  So the Otpusk form does not overflow or overlap on iPhone

  Scenario: Tour search fields stay inside the card and do not overlap
    Given I open the world tours page on iPhone
    And the Otpusk desktop tour form is injected into the world-tours host
    Then the Otpusk form row should not be locked at 890px
    And the Otpusk tour fields should stay inside the host
    And the Otpusk tour fields should not overlap each other
    And the document should use the Otpusk phone form class
