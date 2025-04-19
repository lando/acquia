#!/bin/bash

#
# Waits for a specified user and UID to be correctly mapped within the container.
#
# This script is often used in Lando entrypoints or early build steps to ensure that
# the user that will own web files (e.g., www-data, or a user matching the host UID)
# is fully initialized and its UID is correctly reported by the `id` command.
# This is particularly important for file permission handling when dealing with
# bind mounts from the host OS.
#
# The script attempts to match the output of `id <user>` with the expected UID,
# retrying a set number of times with a delay between attempts.
#
# Arguments:
#   $1: Optional. The username to check (e.g., "www-data", "appuser").
#       Defaults to the value of the $LANDO_WEBROOT_USER environment variable.
#   $2: Optional. The numeric User ID (UID) to verify for the specified user.
#       Defaults to the value of the $LANDO_HOST_UID environment variable.
#
# Environment Variables (used for defaults if arguments are not provided):
#   LANDO_WEBROOT_USER : Default username.
#   LANDO_HOST_UID     : Default UID to check against.
#
# Example usage:
#   /scripts/acquia-wait-for-user.sh
#   /scripts/acquia-wait-for-user.sh myuser 1000
#

set -e

# user info
user="${1:-$LANDO_WEBROOT_USER}"
id="${2:-$LANDO_HOST_UID}"

# retry settings
attempt=0
delay=1
retry=25

until [ "$attempt" -ge "$retry" ]
do
  id "$user"| grep uid | grep "$id" &>/dev/null && break
  attempt=$((attempt+1))
  sleep "$delay"
done
