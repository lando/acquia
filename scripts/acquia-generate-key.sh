#!/bin/bash

#
# Generates an SSH key pair if it doesn't already exist.
#
# This script is used during the `lando init --source acquia` process to ensure
# an SSH key is available for authentication with Acquia Cloud. The keys are
# stored in the /lando/keys directory, which is typically a bind mount to
# the host machine's Lando SSH key store (e.g., ~/.lando/keys).
#
# Arguments:
#   $1: The desired filename for the SSH key (e.g., "my_acquia_key").
#       The public key will be saved as <filename>.pub.
#   $2: A comment to embed in the SSH key (e.g., "user@example.com lando acquia").
#
# Example usage:
#   /scripts/acquia-generate-key.sh my_acquia_key "user@example.com lando"
#

set -e

# Get the key and comment
KEY="$1"
COMMENT="$2"

# Make sure we are set up for success
mkdir -p /lando/keys

# Setup the key if we have it
if [ ! -f "/lando/keys/$KEY" ]; then
  echo "$KEY does not yet exist, generating one..."
  ssh-keygen -t rsa -b 4096 -N "" -C "$COMMENT" -f "/lando/keys/$KEY"
fi
