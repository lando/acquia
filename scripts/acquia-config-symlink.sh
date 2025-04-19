#!/bin/bash

#
# Sets up a persistent storage location for Acquia CLI configuration.
#
# This script creates a directory at /lando/config/${LANDO_APP_NAME}/.acquia,
# which is typically a bind mount to the host machine's Lando configuration
# directory (e.g., ~/.lando/config/<app_name>/.acquia).
# It then creates a symbolic link from /var/www/.acquia (a common location
# where Acquia CLI might look for or store configuration within the container)
# to this persistent directory.
#
# This ensures that any Acquia CLI configuration or tokens generated or used
# within the Lando appserver container are persisted on the host machine
# across container rebuilds or restarts.
#
# Relies on the following environment variables being set:
#   LANDO_APP_NAME: The name of the Lando application.
#

# Creates a .acquia directory for the project
# which can be used by the container via symlink
ACQUIA_CONFIG_DIR="/lando/config/${LANDO_APP_NAME}/.acquia"
mkdir -p $ACQUIA_CONFIG_DIR
ln -sfn ${ACQUIA_CONFIG_DIR} /var/www/.acquia
