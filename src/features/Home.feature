@regression @home
Feature: Luxehouze Home

Background: Pre conditions
        Given user navigate to the Luxehouze home page 

@home-search
Scenario: Verify search functionality on home page
    When user enter "Rolex" in search bar
    Then user should verify search result contain "Rolex"

@home-luxury-watches
Scenario Outline: Verify clicks button and lands on correct page
    When user click '<buttonName>'
    Then user should be redirected to '<expectedPage>'
    Examples:
      | buttonName   | expectedPage |
      | buy-a-watch  | all-watches  |
      | sell-a-watch | sell-with-us |

    