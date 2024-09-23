# Acquia MySQL 8.0 Example

This example exists primarily to test the following documentation:

* [Acquia Recipe](https://docs.lando.dev/acquia/config.html)

Start up tests
--------------

Run the following commands to get up and running with this example.

```bash
# Should start up successfully
lando poweroff
lando start
```

Verification commands
---------------------

Run the following commands to validate things are rolling as they should.

```bash
# Should be running mysql 8.0 by default
lando mysql -V | grep 8.0

# Should be able to connect to the database with the default creds
lando mysql acquia -e quit
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
