# Acquia MySQL 8 Example

This example demonstrates how to use the `database` config key to set MySQL 8.0 as the database server for an Acquia recipe.

## Usage

```yaml
recipe: acquia
config:
  database: mysql:8.0
```

Start the app and verify the database version:

```bash
lando start
lando mysql -V
```

You should see MySQL 8.0.x reported.
