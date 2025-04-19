---
title: Installation
description: How to install the Lando Acquia Plugin.
---

# Installation

If you are using Lando 3 then it's highly likely you already have this plugin as it's included by default in most installation pathways. You can verify this by running:

```sh
lando version --component @lando/acquia
```

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

<!-- TODO: Consider adding a section on how to uninstall the plugin. -->
