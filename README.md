# digitalocean-domain-record-ip-updater

> [!NOTE]
> I no longer use DigitalOcean as my DNS, so I will no longer maintain this repository.

A simple utility to automatically update the IP address of a domain record when it changes. This is useful f.ex when running a home server that uses a domain, and you have a dynamic IP address.

A cron job is running every night at 0300, that checks the current IP, and compares with records set in your DigitalOcean config. If the current IP does not match the IP of the domain record, it will execute a PUT request to update it. To achieve this, both read and write access is required to DigitalOcean. This is set up with an API key.

Thes environment variables are supported:

- `TZ` for setting the correct timezone, so the cron job runs at the correct time.
- `AUTH_TOKEN` for authentication to DigitalOcean. This can be [set up in the dashboard](https://cloud.digitalocean.com/account/api), remember to select both READ and WRITE access.
- `DOMAIN` The domain name to check/update.
- `RECORD_IDS` A comma separated list of record ids to update, useful if f.ex you have multiple `A` records for the domain that should be updated. To get these ID's you can execute a GET request to `https://api.digitalocean.com/v2/domains/${domain}/records/`, and you will get a list of all entries related to that domain. Dont forget to use the access token when executing the request.

Alternatively you can use docker secrets to set the `AUTH_TOKEN`, `DOMAIN` and `RECORD_IDS`, by appending `_FILE` to those variables, and the value of the variable should be the path to the secret to read. F.ex `AUTH_TOKEN_FILE=/run/secrets/digitalocean_auth_token`.
