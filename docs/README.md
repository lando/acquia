# Acquia Lando Plugin

This is the _official_ [Lando](https://lando.dev) plugin for [Acquia](https://acquia.com/). When installed it...

* Allows users to spin up their Acquia projects for development with Lando
* Allows users to sync database relationships and mounts between Acquia and Lando
* Uses Acquia's own images for extremely close parity with production
* Uses Acquia's own configuration files to determine what Lando should run and do
* Provides users with relevant and containerized tooling commands

Of course, once a user is running their Acquia project with Lando they can take advantage of [all the other awesome development features](https://docs.lando.dev) Lando provides.

## Installation

This plugin is included with Lando by default. That means if you have Lando version `3.0.8` or higher then this plugin is already installed!

However if you would like to manually install the plugin, update it to the bleeding edge or install a particular version then use the below. Note that this installation method requires Lando `3.5.0+`.

```bash
# Ensure you have a global plugins directory
mkdir -p ~/.lando/plugins

# Install plugin
# NOTE: Modify the "yarn add @lando/acquia" line to install a particular version eg
# yarn add @lando/acquia@0.5.2
docker run --rm -it -v ${HOME}/.lando/plugins:/plugins -w /tmp node:14-alpine sh -c \
  "yarn init -y \
  && yarn add @lando/acquia --production --flat --no-default-rc --no-lockfile --link-duplicates \
  && yarn install --production --cwd /tmp/node_modules/@lando/acquia \
  && mkdir -p /plugins/@lando \
  && mv --force /tmp/node_modules/@lando/acquia /plugins/@lando/acquia"

# Rebuild the plugin cache
lando --clear
```

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/acquia`. This command will also show you _where_ the plugin is being loaded from.

## Basic Usage

Clone a project down from Acquia.

```bash
# Make and go into an empty directory
mkdir myproject && cd myproject

# Clone down code from Acquia
lando init --source acquia

# Start the project up
lando start

# Pull down relationships and mounts
lando pull
```

Once your project is running you can access [relevant tooling commands](https://github.com/lando/acquia/blob/main/docs/usage.md#application-tooling).


```yaml
name: acquia-drupal9
recipe: acquia
```

For complete usage docs you should check out [this](https://github.com/lando/acquia/blob/main/docs/usage.md), particularly:

* [Supported Services](https://github.com/lando/acquia/blob/main/docs/usage.md#services-yaml)
* [Environment variables](https://github.com/lando/acquia/blob/main/docs/usage.md#environment)
* [Syncing relationships and mounts with Acquia](https://github.com/lando/acquia/blob/main/docs/usage.md#pulling-and-pushing-relationships-and-mounts)
* [Caveats and known issues](https://github.com/lando/acquia/blob/main/docs/usage.md#caveats-and-known-issues)

## Examples and Guides

If you are interested in working and tested examples and/or guides then check out both the [examples](https://github.com/lando/acquia/tree/main/examples) and [guides](https://github.com/lando/acquia/tree/main/guides) folders. Here is a subset of some of our most popular content:

* [Multiapp project example]()
* [Adding additional tooling]()
* [Advanced database usage]()
* [Kitchen sink example]()

@TODO: need to link to the above when they are available

## Issues, Questions and Support

If you have a question or would like some community support we recommend you [join us on Slack](https://launchpass.com/devwithlando).

If you'd like to report a bug or submit a feature request then please [use the issue queue](https://github.com/lando/acquia/issues/new/choose) in this repo.

## Changelog

We try to log all changes big and small in both [THE CHANGELOG](https://github.com/lando/acquia/blob/main/CHANGELOG.md) and the [release notes](https://github.com/lando/acquia/releases).

## Development

If you're interested in working on this plugin then we recommend you check out the [development guide](https://github.com/lando/acquia/blob/main/docs/development.md).

## Contributors

<a href="https://github.com/lando/acquia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lando/acquia" />
</a>

Made with [contributors-img](https://contrib.rocks).

## Other Selected Resources

* [LICENSE](https://github.com/lando/acquia/blob/main/LICENSE.md)
* [The best professional advice ever](https://www.youtube.com/watch?v=tkBVDh7my9Q)
