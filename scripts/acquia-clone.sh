#!/bin/bash

#
# Clones a Git repository from an Acquia Cloud remote URL.
#
# This script is typically used during the `lando init --source acquia` process.
# It handles setting up SSH for Git operations by using a specified key,
# waits for the key to be recognized by Acquia Cloud, and then clones
# the repository using the provided URL and options.
#
# Arguments:
#   $1: The Git repository URL to clone (e.g., user@server:repo.git).
#   $2: Optional Git clone options (e.g., "--branch main", "--depth 1").
#       If empty or "" (an empty quoted string), no options are used.
#   $3: The name of the SSH private key file (without path) located in /lando/keys/
#       to be used for authentication.
#
# Example usage:
#   /scripts/acquia-clone.sh git@github.com:user/repo.git "--branch develop" my_acquia_key
#

set -e

# Get the URL arg and opz
URL=$1
# Get options
if [ "$2" = '""' ]; then
  OPTIONS=
else
  OPTIONS="$2"
fi

# And then get other things
KEY=$3
SRC_DIR=/tmp/source

# Set expectations
echo "Setting up SSH keys..."
# Chill for a sec
sleep 1
# Wait until key is available
echo "Verifying key ($KEY) is available on Acquia Cloud..."
echo "This could take a minute or so..."
# Otherwise we gotta attempt to retry until the key is ready
# TODO: set a max retry limit?
while GIT_SSH_COMMAND='ssh -o IdentityFile=/lando/keys/$KEY -o StrictHostKeyChecking=no' git ls-remote "$URL" 2>&1 | grep "Permission denied (publickey)" > /dev/null; do
  sleep 10
done

# Take another break just to make sure we are ready
sleep 5

# Passthrough to our normal mechanism
/helpers/get-remote-url.sh $URL "$OPTIONS"
