# Acquia Lando Plugin

This is the _official_ [Lando](https://lando.dev) plugin for [Acquia](https://acquia.io). When installed it...

* Closely mimics Acquia's stack, versions and environment locally
* Allows you to easily `pull` your Acquia site down locally
* Allows you to easily `push` your changes back to Acquia
* Installs `drush`, `acli` and other power tools.

Of course, once a user is running their Acquia project with Lando they can take advantage of [all the other awesome development features](https://docs.lando.dev) Lando provides.


## Basic Usage

Clone a project down from Acquia.

```bash
# Make and go into an empty directory
mkdir myproject && cd myproject

# Go through interactive prompts to get your code from acquia
lando init --source acquia

# OR if you already have your acquia code locally
cd /path/to/repo
lando init \
  --source cwd \
  --recipe acquia

# Start it up
lando start

# Import your database and files
lando pull

# List information about this app.
lando info
```

Once your project is running you can access [relevant tooling commands](https://docs.lando.dev/acquia/tooling.html).

For more info you should check out the [docs](https://docs.lando.dev/acquia):

* [Getting Started](https://docs.lando.dev/acquia/getting-started.html)
* [Configuration](https://docs.lando.dev/acquia/config.html)
* [Tooling](https://docs.lando.dev/acquia/tooling.html)
* [Syncing](https://docs.lando.dev/acquia/sync.html)
* [Guides](https://docs.lando.dev/acquia/guides.html)
* [Examples](https://github.com/lando/acquia/tree/main/examples)
* [Development](https://docs.lando.dev/acquia/development.html)

## Issues, Questions and Support

If you have a question or would like some community support we recommend you [join us on Slack](https://launchpass.com/devwithlando).

If you'd like to report a bug or submit a feature request then please [use the issue queue](https://github.com/lando/acquia/issues/new/choose) in this repo.

## Changelog

We try to log all changes big and small in both [THE CHANGELOG](https://github.com/lando/acquia/blob/main/CHANGELOG.md) and the [release notes](https://github.com/lando/acquia/releases).

## Development

If you're interested in working on this plugin then we recommend you check out the [development guide](https://github.com/lando/acquia/blob/main/docs/development.md).


## Maintainers

* [@pirog](https://github.com/pirog)
* [@reynoldsalec](https://github.com/reynoldsalec)

## Contributors

<a href="https://github.com/lando/acquia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lando/acquia" />
</a>

Made with [contributors-img](https://contrib.rocks).

## Other Selected Resources

* [LICENSE](/LICENSE)
* [TERMS OF USE](https://docs.lando.dev/terms)
* [PRIVACY POLICY](https://docs.lando.dev/privacy)

