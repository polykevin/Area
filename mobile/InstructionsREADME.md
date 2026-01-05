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