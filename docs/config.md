---
title: Configuration
description: Learn how to configure the Lando Acquia recipe.
---

# Configuration

While Lando [recipes](https://docs.lando.dev/core/v3/recipes.html) set sane defaults so they work out of the box, they are also [configurable](https://docs.lando.dev/core/v3/recipes.html#config).

Here are the configuration options, set to the default values, for this recipe. If you are unsure about where this goes or what this means we *highly recommend* scanning the [recipes documentation](https://docs.lando.dev/core/v3/recipes.html) to get a good handle on how the magicks work.

```yaml
recipe: acquia
config:
  acli_version: latest
  ah_application_uuid: null
  ah_site_group: null
  build:
    run_scripts: true
  cache: true
  composer_version: '2'
  inbox: true
  php: '8.2'
  xdebug: false
```

If you do not already have a [Landofile](https://docs.lando.dev/core/v3) for your Acquia site, we highly recommend you use [`lando init`](https://docs.lando.dev/cli/init.html) to get one as that will automatically populate the `ah_application_uuid`, `ah_site_group` and `php` version for you. Manually creating a Landofile with these things set correctly can be difficult and is *highly discouraged.*

Note that if the above config options are not enough, all Lando recipes can be further [extended and overridden](https://docs.lando.dev/core/v3/recipes.html#extending-and-overriding-recipes).

## Choosing a composer version

By default the `acquia` recipe will default to the latest stable release of `composer` 2. If your application depends on a different version of composer you can set `composer_version` to any version that is available in our [php service](https://docs.lando.dev/plugins/php/config.html).

```yaml
recipe: acquia
config:
  composer_version: '1.10.1'
```

## Disabling `acli pull:run-scripts`

By default `acli pull:run-scripts` will automatically run on your first `lando start` and on subsequent `lando rebuilds` to ensure your site has the needed code dependencies to run correctly. However, there are some _rare_ situations where this may not be a suitable default. In such cases you can disable this behavior:

```yaml
recipe: acquia
config:
  build:
    run_scripts: false
```

## Customizing the stack

By default, Lando will spin up an approximation of the Acquia stack:

* Apache webserver `2.4`
* MySQL database server `5.7`
* Memcache `1.6`
* PHP `8.2`

Where acquia provides multiple options, we'll choose the current default. PHP is a good example.

Not current supported but coming soon:

* Solr `3`, `4`, `7`

Additionally Lando will provide a configurable `mailhog` service so that you can catch an inspect outgoing mail locally.

This means that what works on Acquia **should** also work on Lando. Please recognize, however, that the Acquia platform is changing all the time and Lando is necessarily reactive in some cases.

If you do not need the umlimited power of a fully armed and operational Acquia stack you can tell Lando to *not use* the more advanced parts of Acquia's stack. This can save time when starting up your app.

```yaml
recipe: acquia
config:
  # Disable the MEMCACHE cache
  cache: false

  # Disable the MAILHOG inbox
  inbox: false
```

Note that if your application code depends on one of these services and you disable them, you should expect an error. Also note that Lando does not track what services you are using on your Acquia site e.g. these settings are "decoupled".

## Using acli

While in `alpha` Lando ships the `acli` built from the latest commit to `master` on GitHub. You can change this behavior in a few ways:

1. Install latest stable release

```yaml
recipe: acquia
config:
  acli_version: latest
```

2. Install a specific release version

```yaml
recipe: acquia
config:
  acli_version: "1.8.1"
```

## Using xdebug

This is just a passthrough option to the [xdebug setting](https://docs.lando.dev/plugins/php/config.html#configuring-xdebug) that exists on all our [php services](https://docs.lando.dev/plugins/php/). The `tl;dr` is `xdebug: true` enables and configures the php xdebug extension and `xdebug: false` disables it.

```yaml
recipe: acquia
config:
  xdebug: true|false
```

However, for more information, we recommend you consult the [php service documentation](https://docs.lando.dev/plugins/php/).
