---
title: Manually importing databases and files
description: Learn how to manually import other databases into your Lando Acquia site.
mailchimp:
  action: https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f
  title: Want more Acquia guide content?
  byline: Signup and we will send you a weekly blog digest of similar content to keep you satiated.
  button: Sign me up!
---

# Manually Importing Databases and Files

In the event that `lando pull` is not working as expected you have a few other things you can try out to grab your database and files.

## Database

```bash
# Use the ACLI directly
lando acli pull:db

# Download and import a database backup
lando db-import database.sql.gz
```

You can learn more about the `db-import` command [over here](https://docs.lando.dev/guides/db-import.html).

## Files

```bash
# Use the ACLI directly
lando acli pull:files
lando database main < dump.sql
```
