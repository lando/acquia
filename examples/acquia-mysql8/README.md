# Acquia MySQL 8 Example

This example exists primarily to test the following documentation:

* [Acquia Recipe - Choosing a database version](https://docs.lando.dev/acquia/config.html)

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
# Should be running mysql 8.0
lando mysql -V | grep 8.0

# Should be able to connect to the database with the default creds
lando mysql acquia -e quit

# Should have the correct database service version in lando info
lando info -s database --path type | grep mysql | grep 8.0
```

## Destroy tests

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
