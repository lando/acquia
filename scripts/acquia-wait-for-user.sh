#!/bin/bash

set -e

# user info
user="${1:-$LANDO_WEBROOT_USER}"
id="${2:-$LANDO_HOST_UID}"

# retry settings
attempt=0
delay=1
retry=5

until [ "$attempt" -ge "$retry" ]
do
  id "$user"| grep uid | grep "$id" &>/dev/null && break
  attempt=$((attempt+1))
  sleep "$delay"
done
