# Quick instructions for mobile client:

- change the ip in api_client.dart to the local ip address
- if error 401, the tokens are expired(usually after 1h), uninstall the app, disconnect the users from the phone and reconnect them

## The serviceAuth tokens expire after one week, because of google's rules for testing-stage applications:

- you need to go to http://localhost:8080/oauth/google/url?userId=<YOUR_DB_USER_ID>
- agree to the consent prompt
- there should be a new serviceAuth line inside the DB (view with prisma studio)
- the area should be working

## NGROK tunnel for callback:

Google does not allow regular IPs for callbacks, it requires a proper web domain. The solution I found is an ngrok tunnel.
This tunnel is used for connecting to the service via the mobile app, without having to go to the website on the host machine.
The ngrok URL is reset every time you restart ngrok, so you need to do this:
- in .env, replace GOOGLE_CALLBACK_URL and the other callback URLs with the new ngrok URL that is provided when you run it
- you might also need to replace it in the google API console

## Instagram Basic Display API:

Meta Developer API is very restrictive with what it allows non-verified users to do.
For this reason, at the moment, I was only able to make one action and no reactions.
Instructions:
- you need to add your account with the Instagram Tester role to the online Meta developer app (I might have to add you to my own app, or you can make the app yourself)
- you will receive the access token
- you need to add the token to the database manually
- create an area from the app using the reaction
- make a post on the instagram account you connected
- the polling runs every minute (Meta has restrictions on how often you can run it)
- you should see the reaction