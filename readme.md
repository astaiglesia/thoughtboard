# webserver thoughtboard v 1.1
<under development>

Tech:
- TypeScript
- Node
- Express

Database:
- Mongo
- Mongoose

Testing:
- Jest
- Supertest

Security: 
- HTTPS
- BCrypt
- PassportJS
- OAuth SSO strategies
  - google
  - facebook
  - linked in
  - github




## Initialize Local Dev Environment
> [] Setup your .env file
     [] populate mongo uri - MONGO_URI='mongodb+srv://rubberducky:password123456789@nodemastery.29bgsi8.mongodb.net/?retryWrites=true&w=majority'
     [] define PORT
     [] google oauth CLIENT_ID
     [] google oauth CLIENT_SECRET
> [] Generate self-signed cert

###  Generate self-signed cert for local server application
HTTPS With Node, Self Signed Certificates, and Public Key Cryptography


HTTPS with Node Services
- e.g. Amazon Cloudfront CDN
- CDN's can automatically require clients to make HTTPS requests for content delivery

use https to build sites that pass private information

**CREATING A SELF-SIGNED CERTIFCATE**
- use OpenSSL to generate a cert
  > should be natively on linux/unix
  > TYP installs on windows with git
  > download from openssl.org 


### PUBLIC KEY CRYPTOPGRAPHY
*openssl command w/ options for generating a self-signed cert with private key*

```
~$ openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
```

flags:
* openssl => toolkit for general purpose cryptography 
* req => requests a new certificate
  -x509 => indicates self-signed cert
  -newkey => contains encyption secret (aka PRIVATE KEY)
    - uses RSA encryption to specify the size of the key
      - RSA: 
        > one of the strongest forms of encryption
        > allows us to specify the size of the key in bits
    - 4096 bits is a strong and frequently used value
* -nodes => allows us to access the new private key without needing to assign a password for access
  - not necessary for dev
* -keyout => specifies the filename for the generated key to (pass filename directly after command)
  - key.pem (TYP name)
* -out => specifies the filename for the generated certificate (pass filename directly after command)
  - cert.pem (TYP name) - public certicate that clients will check against the server
* -days => specifies the valid cert-life in days (pass arg after flag - DEFAULTED to ~30 days)

> during cert generation
  - 'Common Name' is the domain name that has to match the site that the cert is validating
  - for self-signed certs we can put whatever

> keys ensure that only those that own the correct key can encrypt data for a specific server
... certs allows us to decrypt data with a specific key
> browsers require access to public certificates for access to the correct key to decrypt data



*https create server example*

`
https.createServer({
  key: fs.readFileSync('key.pem')      // <path to private key>
  cert: fs.readFileSync('cert.pem')    //<path to public cert>
}, 
  <request listener application>
).listen(<PORT>, <callback>)
`



**Node Notes: don't forget** 
- when we use a Node server to read local files we need to use the fs module
- in above example: readFileSync synchronously accesses target files before passing into create server instance
- *set up dev env with self-signed cert*
- *set up production env with a CA cert*





### Registering with the Google Authorization Server -> google's social sign on

*1st step is always to register our apps with authentication server(s)*

**Registration Flow for Google SSO**

[] Register application in the google dev dashboard > google api console
  [] create new project (if necessary) > credentials tab > Create credentials > create OAuth client ID
    [] Create and Configure OAuth Consent screen (confirm correct project is selected)
      [] expose application to general audience (*external* users) type (internal is for private org avail)
      [] app registration -> add info to render to consent screen
      [] add contact info
      [] select app scopes -> requests for access to specific data tied to the user account (consent checkboxes)
      [] assign test users / whitelist as necessary (skip if pushing straight to production in next step)
      [] back to dashboard > publish app > push to production 
          - (assuming sandbox project - for larger projects push to testing mode and set up whitelist)
          - certain configurations (like adding a logo) will trigger verification requirement

[] credentials > create credentials > OAuth client ID >  application type > app details

[] set authorized JS origins -> add localhost URI for the front-end application that will be making requests to the auth server
      [] add dev environment (https://localhost:3000)
      [] add test + production env URI's as needed

[] set authorized redirect URIs
      [] URI for the endpoint of the server that will handle the authorization code ()
         https://localhost:3000/auth/google/callback => <authendpoint>/<authserver>/endpoint



### Dotenv for Client Secrets
- [] add CLIENT_ID and CLIENT_SECRET to .env
- [] access and assign to config object in server file




