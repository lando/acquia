## {{ UNRELEASED_VERSION }} - [{{ UNRELEASED_DATE }}]({{ UNRELEASED_LINK }})

* Updated to [@lando/vitepress-theme-default-plus@v1.1.0-beta.24](https://github.com/lando/vitepress-theme-default-plus/releases/tag/v1.1.0-beta.24).

## v1.5.1 - [November 4, 2024](https://github.com/lando/acquia/releases/tag/v1.5.1)

* Updated to [@lando/vitepress-theme-default-plus@v1.1.0-beta.18](https://github.com/lando/vitepress-theme-default-plus/releases/tag/v1.1.0-beta.18).

## v1.5.0 - [October 25, 2024](https://github.com/lando/acquia/releases/tag/v1.5.0)

* Updated release process to generate an edge release when stable releases are created.
* Removed unnecessary dependency lando/nginx.
* Updated lando/php to v1.5.0.
* Updated lando/mysql to v1.3.0.

## v1.4.0 - [September 24, 2024](https://github.com/lando/acquia/releases/tag/v1.4.0)

* Upgrading PHP from 8.2 to 8.3 which is the new default at Acquia.
* Upgrade @lando/mysql for better MySQL 8 support 

## v1.3.1 - [September 12, 2024](https://github.com/lando/acquia/releases/tag/v1.3.1)

* Remove option of using MariaDB - It doesn't work and Acquia doesn't support it.

## v1.3.0 - [April 19, 2024](https://github.com/lando/acquia/releases/tag/v1.3.0)

**NOTICE:** If you use the default PHP version, it is now being updated to PHP 8.2. You may need to specify your PHP version in `.lando.yml`, for example, to set it to PHP 8.0:

```
recipe: acquia
config:
  php: '8.0'
```

* Updated mariadb plugin to [v1.3.0](https://github.com/lando/mariadb/releases/tag/v1.3.0). See [#51](https://github.com/lando/mariadb/issues/51).
* Changed default PHP to 8.2 and added testing for PHP versions. [#87](https://github.com/lando/acquia/issues/87)
* Updated Drush 8 to 8.4.10

## v1.2.0 - [March 15, 2024](https://github.com/lando/acquia/releases/tag/v1.2.0)

* Updated mariadb plugin to [v1.2.0](https://github.com/lando/mariadb/releases/tag/v1.2.0).

## v1.1.1 - [March 7, 2024](https://github.com/lando/acquia/releases/tag/v1.1.1)

### Fixes

* Improved `database` selection for purposes of `config` loading, fixes some `database` bootup issues when the `database` type is overriden downstream

## v1.1.0 - [February 21, 2024](https://github.com/lando/acquia/releases/tag/v1.1.0)

* Updated memcached plugin to [v1.1.0](https://github.com/lando/memcached/releases/tag/v1.1.0).
* Added testing of memcached.
* Updated deps.

## v1.0.0 - [December 7, 2023](https://github.com/lando/acquia/releases/tag/v1.0.0)

* Dialed fully for `lando update`

## v0.10.0 - [October 5, 2023](https://github.com/lando/acquia/releases/tag/v0.10.0)

* Added a "wait for user" script to ensure user is loaded before cloning repo. [lando/core#71](https://github.com/lando/core/pull/71)

## v0.9.0 - [July 3, 2023](https://github.com/lando/acquia/releases/tag/v0.9.0)

* Removed bundle-dependencies and version-bump-prompt from plugin.
* Updated package to use prepare-release-action.
* Updated documentation to reflect new release process.

## v0.8.0 - [May 17, 2023](https://github.com/lando/acquia/releases/tag/v0.8.0)

* Added ACLI_DB env vars [#56](https://github.com/lando/acquia/pull/56)
* Updated to PHP 8.1 in the engagedemo app.

## v0.7.0 - [December 12, 2022](https://github.com/lando/acquia/releases/tag/v0.7.0)
* Added bundle-dependencies to release process.
* Fixed bug in plugin dogfooding test.

## v0.6.0 - [September 7, 2022](https://github.com/lando/acquia/releases/tag/v0.6.0)

* Hyperdrived

## v0.5.2 - [April 21, 2022](https://github.com/lando/acquia/releases/tag/v0.5.2)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* Cleaned up unused dependencies

## v0.5.1 - [December 4, 2021](https://github.com/lando/acquia/releases/tag/v0.5.1)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* Addressed memcache misconfiguration issues [pr 25](https://github.com/lando/acquia/pull/25)

## v0.5.0 - [November 9, 2021](https://github.com/lando/acquia/releases/tag/v0.5.0)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* First release of `acquia` as an external plugin!
* Added testing for basic drupal 9 example
