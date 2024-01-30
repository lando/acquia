---
title: Tooling
description: Learn about the various out-of-the-box tooling you get with the Lando Acquia recipe.
---

# CLI Tooling

Each Lando Acquia recipe will also ship with the Acquia toolchain. This means you can use `drush` and `acli` via Lando and avoid mucking up your actual computer trying to manage `php` versions and tooling.

```bash
lando acli              Runs acli commands
lando composer          Runs composer commands
lando db-export [file]  Exports database from a database service to a file
lando db-import <file>  Imports a dump file into a database service
lando drush             Runs drush commands
lando mysql             Drops into a MySQL shell on a database service
lando php               Runs php commands
lando pull              Pull code, database and/or files from acquia
lando push              Push code, database and/or files to acquia
lando switch            Switch to a different multidev environment
lando version           Displays the lando version
```

```bash
# Login to acquia
lando acli auth:login

# Clear drush caches
lando drush cr

# Download a dependency with composer
lando composer config repositories.drupal composer https://packages.drupal.org/8
lando composer require "drupal/search_api_acquia ~1.0" --prefer-dist
```
