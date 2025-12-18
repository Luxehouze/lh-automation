@regression @beauty
Feature: Luxehouze beauty

Background: Pre conditions
        Given user navigate to the Luxehouze beauty page 

@beauty-price @beauty-collection
Scenario: Verify price in product detail page from beauty page
    When user click Charlotte Tilbury in beauty page
    And user select the first suggestion Charlotte Tilbury
    Then user should verify price in product detail page of Charlotte Tilbury

@beauty-filter @beauty-label
Scenario: Verify filter beauty
    When user click category makeup in beauty page
    And user select filter beauty
    Then user should verify result filter beauty in product detail page of makeup