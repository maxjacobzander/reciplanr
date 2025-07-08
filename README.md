# ReciPlanr

## What is it?

ReciPlanr is an app that helps with a process I find to be very helpful: it takes in recipes (either from links or from straight text input) and outputs a pdf shopping list of everything you need for the week (or whatever timeframe you're planning for!).

ReciPlanr is built with a React frontend and a Node.js backend with Express.

## What's the reci-plan?

v1 of this app is going to be the simplest version of this, acting as a proof-of-concept. It will have three stages:

1. A frontend to accept text inputs for recipes
2. A simple backend to parse the text, return the shopping list, and generate the downloadable PDF
3. Leverage some package TBD to generate a downloadable pdf

The functionality on the backend is probably to:

1. Use a Hash or JS Object to track ingredients and amounts
   - This hash or object will functionally become our shopping list
2. Convert unit of measurement for standardization
3. Utilize find or create logic to check for existence of ingredient
4. Add ingredient if necessary and amount OR add amount to existing ingredient in the shopping list

The functionality on the front end is probably:

1. Two inputs: one for links and one for text recipes
2. onSubmit kick off the backend logic
3. Display out the list as it stands
4. Button to generate PDF when complete

## Potential challenges:

- Standardizing ingredient lists from various sources
- Interacting with APIs to add together ingredient amounts
- One of the big difficulties was getting sessions to persist. This turned out to be a connection issue with my redis instance

## Future Ideas

- Separate lists by grocery store departments
- Toggle for metric/imperial?
- For v2, add function to convert ingredient lines to more structured format
- Add functionality to remove ingredients from shopping list
- Add functionality to clear shopping list
