---
title: Getting Started
description: Learn how to get started with the Lando Acquia recipe.
---

# Getting Started

## Requirements

Before you get started with this recipe, we assume that you have:

1. [Installed Lando](https://docs.lando.dev/getting-started/installation.html) and gotten familiar with [its basics](https://docs.lando.dev/cli/).
2. [Initialized](https://docs.lando.dev/cli/init.html) a [Landofile](https://docs.lando.dev/core/v3) for your codebase for use with this recipe.
3. Read about the various [services](https://docs.lando.dev/core/v3/services/lando.html), [tooling](https://docs.lando.dev/core/v3/tooling.html), [events](https://docs.lando.dev/core/v3/events.html) and [routing](https://docs.lando.dev/core/v3/proxy.html) Lando offers.

## Quick Start

You can also run the following commands to try out this recipe on one of your Acquia sites.

```bash
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

## Custom Installation

This plugin is included with Lando by default. That means if you have Lando version `3.0.8` or higher then this plugin is already installed!

However if you would like to manually install the plugin, update it to the bleeding edge or install a particular version then use the below. Note that this installation method requires Lando `3.5.0+`.

:::: code-group
::: code-group-item DOCKER
```bash:no-line-numbers
# Ensure you have a global plugins directory
mkdir -p ~/.lando/plugins

# Install plugin
# NOTE: Modify the "npm install @lando/acquia" line to install a particular version eg
# npm install @lando/acquia@0.5.2
docker run --rm -it -v ${HOME}/.lando/plugins:/plugins -w /tmp node:14-alpine sh -c \
  "npm init -y \
  && npm install @lando/acquia --production --flat --no-default-rc --no-lockfile --link-duplicates \
  && npm install --production --cwd /tmp/node_modules/@lando/acquia \
  && mkdir -p /plugins/@lando \
  && mv --force /tmp/node_modules/@lando/acquia /plugins/@lando/acquia"

# Rebuild the plugin cache
lando --clear
```
:::
::: code-group-item HYPERDRIVE
```bash:no-line-numbers
# @TODO
# @NOTE: This doesn't actaully work yet
hyperdrive install @lando/acquia
```
::::

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/acquia`. This command will also show you _where_ the plugin is being loaded from.
