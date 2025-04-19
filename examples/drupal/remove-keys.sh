#!/bin/bash

#
# Removes an SSH key from an Acquia Cloud account via direct API calls.
#
# This script is used in the Drupal example's cleanup process to remove the
# SSH key that was programmatically added during `lando init`.
# It uses curl to make HTTP requests to the Acquia API and jq to parse JSON responses.
#
# Arguments:
#   $1: Acquia API Key (Client ID).
#   $2: Acquia API Secret.
#   $3: The base label of the SSH key to remove (e.g., "MyLandoKey").
#       The script appends "1" to this label (e.g., "MyLandoKey1") to match
#       the naming convention used by the Lando Acquia plugin when posting keys
#       (see lib/api.js, postKey function which appends a number for uniqueness).
#
# Dependencies:
#   - curl: For making HTTP requests.
#   - jq: For parsing JSON responses from the API.
#     The script assumes these are available in the environment where it runs
#     (e.g., within the Lando appserver container, potentially after installing them).
#
# Example usage (typically invoked from within a Lando container as part of cleanup):
#   ./remove-keys.sh "your_api_key" "your_api_secret" "unique_run_id_for_key_label"
#

KEY="$1"
SECRET="$2"
KEYID="${3}1"

# Get our access token from CURLZ
TOKEN=$(curl -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "client_id": "'"$KEY"'",
  "client_secret": "'"$SECRET"'",
  "grant_type": "client_credentials",
  "scope": ""
}' \
 'https://accounts.acquia.com/api/auth/oauth/token' | jq -r '.access_token')

# Discover the key we need to remove
echo "Trying to get the UUID for $KEYID with token $TOKEN"...
KEY_UUID=$(curl -X GET \
   -H "Authorization: Bearer $TOKEN" \
 'https://cloud.acquia.com/api/account/ssh-keys' | jq '._embedded.items[]' | KEYID="$KEYID" jq 'select(.label == env.KEYID)' | jq -r '.uuid')

echo "Trying to remove key $KEY_UUID"...
ERROR=$(curl -X DELETE \
 -H "Authorization: Bearer $TOKEN" \
 "https://cloud.acquia.com/api/account/ssh-keys/$KEY_UUID" | jq '.error')

# If we have an error then proceed
if [[ "$ERROR" == "null" ]]; then
  exit 0
else
  curl -X DELETE -H "Authorization: Bearer $TOKEN" "https://cloud.acquia.com/api/account/ssh-keys/$KEY_UUID"
  exit 1
fi
