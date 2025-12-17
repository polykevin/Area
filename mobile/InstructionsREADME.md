# Quick instructions for mobile client:

- change the ip in api_client.dart to the local ip address
- if error 401, the tokens are expired(usually after 1h), uninstall the app, disconnect the users from the phone and reconnect them

## The serviceAuth tokens expire after one week, because of google's rules for testing-stage applications:

- you need to go to http://localhost:8080/oauth/google/url?userId=<YOUR_DB_USER_ID>
- agree to the consent prompt
- there should be a new serviceAuth line inside the DB (view with prisma studio)
- the area should be working