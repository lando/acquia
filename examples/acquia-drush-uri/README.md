# Acquia Drush URI Example

This example exists primarily to test the following documentation:

* [Acquia Recipe - Configuring Drush URI](https://docs.lando.dev/acquia/config.html#configuring-drush-uri)

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
# Should have DRUSH_OPTIONS_URI set to the default proxy URL (with https)
lando exec appserver -- env | grep DRUSH_OPTIONS_URI | grep "https://acquia-drush-uri.lndo.site"
```

## Custom drush_uri test

```bash
# Should be able to set a custom drush_uri
cp .lando.yml .lando.yml.bak
cat > .lando.yml <<EOF
name: acquia-drush-uri
recipe: acquia
config:
  drush_uri: 'https://custom-uri.lndo.site'

plugins:
  "@lando/acquia": ../..
EOF

# Should rebuild successfully with custom drush_uri
lando rebuild -y

# Should have DRUSH_OPTIONS_URI set to the custom URI
lando exec appserver -- env | grep DRUSH_OPTIONS_URI | grep "https://custom-uri.lndo.site"

# Restore original .lando.yml
mv .lando.yml.bak .lando.yml
```

## Destroy tests

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
