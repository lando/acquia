# Acquia Development Guide

This guide contains information to help onboard developers to work on the [Acquia](https://acquia.com) integration, hereafter referred to as "the plugin".

After reading through it the developer should understand:

* The high level goals of the integration
* The general features roadmap
* How the plugin is structured
* How additional services containers are added
* How additional tooling is added
* How the project is tested
* Where framework level overrides live
* Contributing code

It may also be valuable to review the [user documentation](https://docs.lando.dev/config/acquia.html) for this integration as that provides a bit of a Specification as Documentation.

## Overview

The high level goals of the integration are straightforward:

### 1. Use Acquia images

This allow users to run their Acquia projects locally using the same images, build processes, configuration, etc as they do on Acquia itself. This means that a Landofile using the `acquia` recipe can be be something simple like this:

```yaml
name: lando-acquia
recipe: acquia
```

The implication here is that Lando will instead look and use the `acquia` configuration files, including its `docker-compose` files instead of its own mechanisms. You can, however, still use the Landofile for additional power you may need exclusively in the local context.

As you have probably noted, Lando does the above OOTB so this should not be a huge challenge. The value add that Lando provides here is basically simplying the onboarding and spinup process and standardizing that flow across os, projects, etc.

### 2. Provide other "flavors" and a broader base of "services"

TBD

### 3. Interact with the remote Acquia environment

TBD on how we want to do this.

### 4. Get all the other built-in benefits of Lando

RTFM if you need more info on dat.

## Roadmap

We have currently secured funding for the first phase of the roadmap but we still need to fund phases two and three.

The tentative roadmap for acheiving the above is

### 1. Alpha Release (Fall 2020)

* An alpha quality release that covers sections 1. and 2. in the overview.
* This release is scheduled to be an "internal alpha" but it may be ok to cast a wider net as long as the alpha part is understood.
* A user should be able to `lando init` a cloned down `acquia` Drupal 8/9 git repo that is properly configured for use with Lando and get it running
* Popular Drupal services like `mariadb`, `mysql`, `memcached`, `redis`, `solr`, `postgresql` and `varnish` are expected to work

These are all expected to be delivered at `alpha` level quality eg the 80/20 rule for use case coverage is probably a good quality threshold.

### 2. Public Beta Release (TBD)

* TBD

### 3. Public RC Release (TBD)

* TBD

### 4. Long Term Support (TBD)

* TBD

## Project Structure

This plugin follows the same structure as any [Lando plugin](https://docs.lando.dev/contrib/contrib-plugins.html#plugins) but here is an explicit breakdown:

```bash
./
|-- lib             Utilities and helpers, things that can easily be unit tested
|-- recipes
    |-- acquia      The files to define the `acquia` recipe and its `init` command
|-- services        Defines each Acquia service eg `solr` or `php`
|-- test            Unit tests
|-- types           Defines the type/parent each above service can be
|-- app.js          Modifications to the app runtime
|-- index.js        Modifications to the Lando runtime
```

## Services and Types

TBD

## Getting started

It's easiest to develop by spinnning up the Acquia D9 example directly in the Lando codebase

* [Drupal](https://github.com/lando/acquia/tree/main/examples/drupal)

```bash
# This assumes you have already installed lando from source and are in its root directory
cd examples/drupal

# Spin up one of your Acquia Sites
rm -rf drupal && mkdir -p drupal && cd drupal
lando init --source acquia --acquia-key "$ACQUIA_API_KEY" --acquia-secret "$ACQUIA_API_SECRET" --acquia-app "$ACQUIA_APP_ID" 
lando start
```

## Other considerations

### Limited support

TBD

### Development

This is going to be a lean and agile project where user feedback drives development. For example a user is going to try it out and say "cool, but what about solr", Amazee will add support for Solr to the relevant example repos, let us know, and then we will add support/tests for solr in Lando.

## Testing

Its best to familiarize yourself with how Lando [does testing](https://docs.lando.dev/contrib/contrib-testing.html) in general before proceeding.

### Unit Tests

Generally, unit testable code should be placed in `lib` and then the associated test in `tests` in the form `FILE-BEING-TESTED.spec.js`. Here is an example:


```bash
./
|-- lib
    |-- stuff.js
|-- test
    |-- stuff.spec.js
```

These tests can then be run with `yarn test:unit`.

### Func Tests

Func tests are made by just adding more entries to each examples README. This uses our made-just-for-Lando testing framework [Leia](https://github.com/lando/leia). See below for our current acquia tests:

* [Drupal](https://github.com/lando/acquia/tree/main/examples/drupal)

These are then run by GitHub Actions. While you _can_ run all the func test locally this can take a LONG time. If you decide you want to do that we recommend you generate the test files and then invoke the tests for just one example.

```bash
# Generate tests
yarn generate-tests

# Run a single examples tests
yarn mocha --timeout 900000 test/acquia-drupal-9-example.func.js
```

## Contribution

WIP but outline is

1. GitHub flow as normal eg branch for an issue -> PR -> merge
2. Lets review all Acquia PRs together for awhile: this should keep us on the same page and also force knowledge transfer
3. Lets definitely be updating the user docs/dev docs
4. Once we have the d8 and kitchen sink example func tests lets also be adding tests on every commit
5. Lets wait on unit tests until things settle down a bit but a good rule of thumb is try to put things we would want to unit tests in `lib` somewhere.
