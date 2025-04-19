---
title: Getting Started
description: Learn how to get started with the Lando Acquia recipe.
---

# Getting Started

## Requirements

Before you get started with this recipe, we assume that you have:

1. [Installed Lando](https://docs.lando.dev/getting-started/installation.html) and gotten familiar with [its basics](https://docs.lando.dev/cli/).
2. An Acquia application either checked out locally or accessible via Acquia Cloud API.
3. Read about the various [services](https://docs.lando.dev/services/lando-3.html), [tooling](https://docs.lando.dev/landofile/tooling.html), [events](https://docs.lando.dev/landofile/events.html) and [routing](https://docs.lando.dev/landofile/proxy.html) Lando offers.

## Initializing Your Acquia Project with Lando

Lando uses a `Landofile` to understand your project. You can create one easily using the `lando init` command.

```bash
# If your Acquia code is not yet local, Lando can download it for you:
lando init --source acquia

# OR if you already have your Acquia code locally:
cd /path/to/your/acquia/repo
lando init \
  --source cwd \
  --recipe acquia
```

This will create a basic `Landofile` tailored for your Acquia application.

## Quick Start Commands

Once your `Landofile` is created, here are the next steps:

```bash
# Start it up
lando start

# Import your database and files from Acquia
lando pull

# List information about this app.
lando info
```

## Custom Installation

This plugin is included with Lando by default. That means if you have Lando version `3.0.8` or higher then this plugin is already installed!

However, if you would like to manually install the plugin, update it to the latest development version, or install a particular version, you can use the `lando plugin-add` command. For more details on how to use this command, please see the [official documentation](https://docs.lando.dev/cli/plugin-add.html).

For example, to install the latest version of the Acquia plugin, you would run:
```bash
lando plugin-add @lando/acquia
```

To install a specific version, you can specify it like so:
```bash
lando plugin-add @lando/acquia@0.5.2
```

To update Lando and its plugins, including this one, you can use the `lando update` command. More information can be found in the [update documentation](https://docs.lando.dev/cli/update.html).

```bash
lando update
```

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/acquia`. This command will also show you _where_ the plugin is being loaded from.
