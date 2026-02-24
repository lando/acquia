# Acquia MySQL 5.7 Example

This example demonstrates how to use the `database` config key to pin MySQL 5.7 as the database server, overriding the default MySQL 8.0.

## Usage

```yaml
recipe: acquia
config:
  database: mysql:5.7
```

Start the app and verify the database version:

```bash
lando start
lando mysql -V
```

You should see MySQL 5.7.x reported.
