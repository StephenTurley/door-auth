### Start Dev server

- `npm run dev`

### Run tests

- `npm test`

### Test Certificates

- located in 'certs/'
- all CA certs have a password of `password`

### Create a new CA

- `cd scripts`
- `./create-ca.sh my-new-ca`

### Create a new signed cert

- `cd scripts`
- `./create-signed-cert.sh my-new-cert my-ca` **the ca must already be created an located in the `certs/` dir**
