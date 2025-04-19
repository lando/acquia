---
description: Learn how to sync databases, files, relationships and mounts between your local Lando site and your remote Acquia site.
---

# Syncing

Lando also provides wrapper commands called `lando pull` and `lando push`.

With `lando pull` you can import data and download files from your remote Acquia site. With `lando push` you can do the opposite, export data or upload files to your remote Acquia site.

Note that only database relationships are currently syncable.

## Pulling

Lando provides a command for Acquia sites called `lando pull` to get your database and files.

Note that if Lando cannot find an [Acquia API key](https://docs.acquia.com/acquia-cloud-platform/develop-apps/api/auth) associated with your local site, it will prompt you to enter one. You can also switch to a different key by using the  `--key` and `--secret` options.

#### Usage

```bash
# Pull the latest code, database and files
lando pull

# Skip a code merge
lando pull --code=none

# Pull only the database from the dev environment
lando pull --code=none --database=dev --files=none

# Attempt a pull using a different key and secret
lando pull --key "$ACQUIA_KEY" --secret "$ACQUIA_SECRET"
```

#### Options

```bash
--verbose, -v   Runs with extra verbosity
--code, -c      The environment from which to pull the code
--database, -d  The environment from which to pull the database
--files, -f     The environment from which to pull the files
--key           An Acquia API Client ID
--secret        An Acquia API Client Secret
```

Please consult the [manual import documentation](./guides/manually-importing-databases.md) if this command produces an error.

## Pushing

While a best practices workflow suggests you put all your changes in code and push those changes with `git`, Lando provides a utility command for `acquia` recipes called `lando push` that pushes up any code, database or files changes you have made locally.

**By default, we set `--database` or `--files` to `none` since this is the suggested best practice**.

Note again that if Lando cannot find an [Acquia API key](https://docs.acquia.com/acquia-cloud-platform/develop-apps/api/auth) associated with your local site, it will prompt you to enter one. You can also switch to a different key by using the  `--key` and `--secret` options.

#### Usage

```bash
# Push the latest code, database and files
lando push
```

It's important to note that by default, `lando push` will only push code changes. To push your database or files, you must explicitly use the `--database` or `--files` options, specifying the target environment. For example, `lando push --database=dev --files=dev` would push the database and files to the 'dev' environment. This default behavior encourages best practices, where database and file changes are typically handled with more caution or through different workflows.

#### Options

```bash
--verbose, -v   Runs with extra verbosity
--code, -c      The environment to which to push the code
--database, -d  The environment to which to push the database
--files, -f     The environment to which to push the files
--key           An Acquia API Client ID
--secret        An Acquia API Client Secret
```
