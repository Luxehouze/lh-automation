@regression @fashion
Feature: Luxehouze Fashion

Background: Pre conditions
        Given user navigate to the Luxehouze fashion page 

@fashion-price @fashion-collection
Scenario: Verify price in product detail page from fashion page
    When user click clothes in fashion page
    And user select the first suggestion of clothes
    Then user should verify price in product detail page of clothes

@fashion-filter @fashion-label
Scenario: Verify filter fashion
    When user click Prada in fashion page
    And user select filter fashion
    Then user should verify result filter fashion in product detail page of Prada