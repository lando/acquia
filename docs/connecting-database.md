---
title: Connecting to your database
description: Learn how to connect to your Acquia database in Lando.
mailchimp:
  action: https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f
  title: Want more Acquia guide content?
  byline: Signup and we will send you a weekly blog digest of similar content to keep you satiated.
  button: Sign me up!
---

Just like on Acquia, Lando will automatically configure your application to connect to its local database and cache. Note that in some cases, such as when the user has purposefully removed the sourcing of the `${project}-settings.inc` file, this will not work.

If you find yourself in this situation and need to manually connect to the database or cache credentials for each are below:

Note that the `host` is not `localhost` but `database` and `cache` for `mysql` and `memcache` respectively.

```yaml
# Database
database: acquia
username: acquia
password: acquia
host: database
port: 3306

# Cache
host: cache
port: 11211
```

You can get also get the above information, and more, by using the [`lando info`](https://docs.lando.dev/cli/info.html) command or you can check out the environment variable called [`LANDO INFO`](https://docs.lando.dev/guides/lando-info.html) as it contains useful information about how your application can access other Lando services.
