<?php

/**
 * @file
 * Lando-specific settings to mimic Acquia Cloud environment for Drupal.
 * This file is typically included in Drupal's settings.php.
 */

// Set the Acquia database name using the AH_SITE_GROUP environment variable,
// which corresponds to the Acquia application/site name.
$conf['acquia_hosting_site_info']['db']['name'] = getenv('AH_SITE_GROUP');

// Define the default database connection details.
// These point to the Lando 'database' service, using standard credentials for the Acquia recipe.
$databases['default']['default'] = [
  'database' => 'acquia', // Database name within the Lando database service
  'username' => 'acquia',
  'password' => 'acquia',
  'host' => 'database', // The Lando service name for the database
  'port' => '3306',
  'driver' => 'mysql',
  'prefix' => '',
];

// Generate a consistent Drupal hash salt based on Lando's host IP.
// This ensures the salt remains the same across `lando rebuild` operations.
$settings['hash_salt'] = md5(getenv('LANDO_HOST_IP'));

// Configure Memcache settings to point to the Lando 'cache' service (if enabled).
$settings['memcache']['servers'] = ['cache:11211' => 'default']; // 'cache' is the Lando service name for Memcached
$settings['memcache']['bins'] = ['default' => 'default'];
$settings['memcache']['key_prefix'] = '';
