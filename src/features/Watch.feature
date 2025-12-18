@regression @watch
Feature: Luxehouze Watch

Background: Pre conditions
        Given user navigate to the Luxehouze watch page 

@watch-price @watch-collection
Scenario: Verify price in product detail page from watch page
    When user click patek phillippe in watch page
    And user select the first suggestion
    Then user should verify price in product detail page of Patek Phillippe

@watch-filter @watch-label
Scenario: Verify filter watch
    When user click Omega in watch page
    And user select filter
    Then user should verify result filter in product detail page of Omega