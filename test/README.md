## Test scenarios

The project was tested using a set of manual tests scenarios which are provided here. The list is non-exhaustive, mostly used for regression testing. Exploratory testing was performed by the team members as well.

1. **Existing user login**

   *Given* a user exists  
   *When* I log using Log in with Email/Password on the login page  
   *Then* I get redirected to the main page  


2. **Display KPI definitions**

   *Given* a user is logged in  
   *And* there exist KPI definitions  
   *When* I type in a KPI definition name fragment in the top search bar  
   *Then* a list of matching KPI definitions is displayed  


3. **Display KPI values**

   *Given* a user is logged in and on the 'KPIs' page  
   *And* there is a KPI definition with values inserted previously  
   *When* I click on a KPI name  
   *Then* a modal is opened  
   *And* the values are displayed in the table "Previous values"  


4. **Insert new KPI value**

   *Given* a user is logged in and has the KPI modal open  
   *And* no values exist for the selected KPI  
   *When* I fill in the date field with a past date  
   *And* I fill in the value with a valid numeric value  
   *And* I click "Save"  
   *Then* the "Previous values" table is reloaded  
   *And* the new value is displayed for the matching period  


5. **Update of a KPI value**

   *Given* a user is logged in and has the KPI modal open  
   *And* a value exists for the selected KPI  
   *When* I fill in the date field with a date matching the period  
   *And* I fill in the value with a valid numeric value, different from the existing one  
   *And* I click "Save"  
   *Then* the "Previous values" table is reloaded  
   *And* the new value is displayed for the matching period  


6. **Switch default circle**

   *Given* a user is logged in   
   *And* I open the "Settings" screen   
   *When* I change the default circle  
   *And* I click "Save"  
   *Then* I should be redirected to the new default circle page  



