#!/bin/bash

#
# Pulls code, database, and/or files from an Acquia Cloud environment to the local Lando setup.
#
# This script is executed by the `lando pull` command for Acquia recipes.
# It uses `acli` (Acquia CLI) to perform the pull operations.
#
# Arguments:
#   -k, --key <API_KEY>        : Acquia API Key for authentication.
#   -s, --secret <API_SECRET>  : Acquia API Secret for authentication.
#   -c, --code <ENV_NAME>      : The Acquia environment name from which to pull code (e.g., 'dev', 'stg').
#                                  Defaults to 'dev'. Use 'none' to skip pulling code.
#   -d, --database <ENV_NAME>  : The Acquia environment name from which to pull the database (e.g., 'dev', 'stg').
#                                  Defaults to 'dev'. Use 'none' to skip pulling the database.
#                                  If pulling a database, existing tables in the local 'acquia' db are dropped.
#   -f, --files <ENV_NAME>     : The Acquia environment name from which to pull files (e.g., 'dev', 'stg').
#                                  Defaults to 'dev'. Use 'none' to skip pulling files.
#   --rsync                    : (Currently parsed but not explicitly used by acli pull commands in this script).
#   --no-auth                  : (Currently parsed but not explicitly used to prevent auth if key/secret are given).
#
# Environment Variables:
#   AH_SITE_GROUP              : The Acquia site group (e.g., 'mysite'). Used to construct full environment
#                                  identifiers like `mysite.dev` for acli commands.
#   LANDO_DB_USER_TABLE        : Optional. The name of a table to check for after a database pull to verify success.
#                                  Defaults to 'users' if not set.
#
# Example usage (typically invoked by Lando, not directly):
#   /scripts/acquia-pull.sh --key <key> --secret <secret> --code dev --database dev --files stage
#

set -e

# Get the lando logger
. /helpers/log.sh

# Set the module
LANDO_MODULE="acquia"

# Set option defaults
CODE='dev';
DATABASE='dev';
FILES='dev';
KEY='none'
SECRET='none'

# PARSE THE ARGZZ
while (( "$#" )); do
  case "$1" in
    -k|--key|--key=*)
      echo '--'
      if [ "${1##--key=}" != "$1" ]; then
        KEY="${1##--key=}"
        shift
      else
        KEY=$2
        shift 2
      fi
      ;;
    -s|--secret|--secret=*)
      if [ "${1##--secret=}" != "$1" ]; then
        SECRET="${1##--secret=}"
        shift
      else
        SECRET=$2
        shift 2
      fi
      ;;
    -c|--code|--code=*)
      if [ "${1##--code=}" != "$1" ]; then
        CODE="${1##--code=}"
        shift
      else
        CODE=$2
        shift 2
      fi
      ;;
    -d|--database|--database=*)
      if [ "${1##--database=}" != "$1" ]; then
        DATABASE="${1##--database=}";
        shift
      else
        DATABASE=$2
        shift 2
      fi
      ;;
    -f|--files|--files=*)
      if [ "${1##--files=}" != "$1" ]; then
        FILES="${1##--files=}"
        shift
      else
        FILES=$2
        shift 2
      fi
      ;;
    --rsync|--rsync=*)
        RSYNC=$1
        shift
      ;;
    --no-auth)
        NO_AUTH=true
        shift
      ;;
    --)
      shift
      break
      ;;
    -*|--*=)
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Generate token with the key passed from tooling
if [ "$KEY" != "none" ]; then
  /usr/local/bin/acli auth:login -k "$KEY" -s "$SECRET" -n
fi

# @TODO: if lando has not already generated and exchanged a key with acquia cloud let us do that here

# Get the codez
if [ "$CODE" != "none" ]; then
  acli -n pull:code "$AH_SITE_GROUP.$CODE"
fi

# Get the database
if [ "$DATABASE" != "none" ]; then
  # Destroy existing tables
  # NOTE: We do this so the source DB **EXACTLY MATCHES** the target DB
  TABLES=$(mysql --user=acquia --password=acquia --database=acquia --host=database --port=3306 -e 'SHOW TABLES' | awk '{ print $1}' | grep -v '^Tables' ) || true
  echo -n "    "
  lando_check "Destroying all current tables in local database if needed... "
  for t in $TABLES; do
    echo -n "    "
    lando_check "Dropping $t from local acquia database..."
    mysql --user=acquia --password=acquia --database=acquia --host=database --port=3306 <<-EOF
      SET FOREIGN_KEY_CHECKS=0;
      DROP VIEW IF EXISTS \`$t\`;
      DROP TABLE IF EXISTS \`$t\`;
EOF
  done

  # Importing database
  acli -n pull:db "$AH_SITE_GROUP.$DATABASE"

  # Weak check that we got tables
  PULL_DB_CHECK_TABLE=${LANDO_DB_USER_TABLE:-users}
  echo -n "    "
  lando_check "Checking db pull for expected tables..."
  if ! mysql --user=acquia --password=acquia --database=acquia --host=database --port=3306 -e "SHOW TABLES;" | grep $PULL_DB_CHECK_TABLE >/dev/null; then
    lando_red "Database pull failed... "
    exit 1
  fi
fi

# Get the files
if [ "$FILES" != "none" ]; then
  # acli -n pull:files "$FILES" -> non interactive causes a broken pipe error right now
  acli -n pull:files "$AH_SITE_GROUP.$FILES"
fi

# Finish up!
echo -n "    "
lando_check "Pull completed successfully!"
