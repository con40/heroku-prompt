# Prompt app

An Node.js web app that performs custom prompts during an Auth0 login flow.

## Configuration

The app will require the following environment variables to run:

* `PORT`: The HTTP port for the server to listen on (use `443` for local)
* `AUTH0_DOMAIN`: The domain of the Auth0 tenant (eg. `example.auth0.com`)
* `BASE_URL`: The base URL of the server (use `https://prompt.demo` for local)
* `ISSUER_BASE_URL`: The base URL of the Auth0 authorization server (eg. `https://AUTH0_TENANT.us.auth0.com`, `https://CUSTOM_DOMAIN`)
* `CLIENT_ID` / `CLIENT_SECRET`: The client credentials of the `Prompt` application in the [Auth0 tenant](../../tenants/prompt-app)
* `SECRET`: A random secret used to encrypt web sessions
* `SESSION_TOKEN_SECRET`: A secret used to verify the signature of the JWT session token sent from the Auth0 tenant. Should be the same as the secret used in the [Auth0 tenant](../../tenants/prompt-app) to sign the session tokens.
* `MORGAN_FORMAT`: The [predefined format](https://github.com/expressjs/morgan#predefined-formats) for Morgan logs (default: `short`)

## Run locally

### Local setup

1. Create a `.env` file with the above settings

1. Edit your local `/etc/hosts` file to contain the following entries:

   ```text
   127.0.0.1  prompt.demo
   ```

1. Create the demo certificate:

   ```bash
   bash ./cert/create-demo-cert.sh
   ```

1. Install the demo certificate (when prompted, enter your local admin user password):

   ```bash
   bash ./cert/install-demo-cert.sh
   ```

   > NOTE: You may need to restart your browser for the newly installed certificate to take effect

1. Install NPM dependencies:

   ```bash
   npm install
   ```

### Start the server

```bash
npm start
```

Access the app at:  
`https://prompt.demo/`

## Deploy and run in Heroku

1. Configure the Heroku app with the above [configuration](#configuration) (except `PORT`)

1. Run this from root of the workspace:

   ```bash
   git subtree push --prefix apps/prompt HEROKU_REMOTE master
   ```

   where `HEROKU_REMOTE` is the unique git remote name for the Heroku app (eg. `heroku-prompt`)

1. Access the app at `https://HEROKU_APP_DOMAIN.herokuapp.com`
