# Acquia 8.3 Example

This example exists primarily to test the following documentation:

* [Acquia Recipe](https://docs.lando.dev/acquia/config.html)

## Start up tests

Run the following commands to get up and running with this example.

```bash
# Should start up successfully
lando poweroff
lando start
```

## Verification commands

Run the following commands to validate things are rolling as they should.

```bash
# Should have acli
lando acli -V

# Should be running apache 2.4 by default
lando ssh -s appserver -c "apachectl -V | grep Apache/2.4"
lando ssh -s appserver -c "curl -IL localhost" | grep Server | grep 2.4

# Should use php 8.3, the default
lando php -v | grep "PHP 8.3"

# Should be running mysql 8.0 by default
lando mysql -V | grep 8.0

# Should be able to connect to the database with the default creds
lando mysql acquia -e quit

# Should be running memcached 1.6
lando ssh -s cache -c "memcached --version | grep 1.6"

# Check index is loading
lando ssh -s appserver -c "curl -L localhost" | grep "Hello Lando!"

# Check if AH_SITE_ENVIRONMENT is set
lando ssh -s appserver -c "curl -L localhost/site-environment.php" | grep "LANDO"
```

## Destroy tests

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
