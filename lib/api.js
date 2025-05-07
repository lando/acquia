'use strict';

const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');
const qs = require('qs');

module.exports = class AcquiaApi {
  constructor(lando) {
    /** @type {object} Lando instance, used for promises and other Lando utilities. */
    this.lando = lando;
    /** @type {string} The base URL for Acquia account authentication. */
    this.authURL = 'https://accounts.acquia.com/api/auth/oauth/token';
    /** @type {object|null} Stores the Acquia API authentication token. */
    this.token = null;
    /** @type {object|null} Stores the Acquia user account details. */
    this.account = null;
    /** @type {Array<object>|null} Stores the list of Acquia applications. */
    this.applications = null;
    this.api = null;
  }

  /**
   * Authenticates with the Acquia API and retrieves an access token.
   * Optionally, it can also fetch the user's account details.
   * The token and account details are cached on the instance for subsequent calls,
   * unless `force` is true.
   *
   * @param {string} clientId The Acquia API client ID.
   * @param {string} clientSecret The Acquia API client secret.
   * @param {boolean} [force] If true, bypasses the cache and re-authenticates.
   * @param {boolean} [tokenOnly] If true, resolves only with the token, skipping the account fetch.
   * @return {Promise<object>} A promise that resolves to the account object or the token object if tokenOnly is true.
   */
  auth(clientId, clientSecret, force = false, tokenOnly = false) {
    // @see https://docs.acquia.com/cloud-platform/develop/api/auth/#making-api-calls-through-single-sign-on
    if (!force && this.token !== null) {
      return new this.lando.Promise(this.account);
    }
    // Clear account to assure the account on this object
    // matches the token if auth is run more than once.
    const data = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: '',
    });

    return axios.post(this.authURL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(res => {
        // Set token and auth headers
        this.token = res.data;

        // Create a new axios instance with the token for futere requests
        this.api = axios.create({
          baseURL: 'https://cloud.acquia.com/api/',
          headers: {
            Authorization: `Bearer ${this.token.access_token}`,
          },
        });
      })
      .catch(err => {
        throw err.response.data.error_description;
      })
      .then(() => {
        if (tokenOnly) {
          return this.token;
        }
        return this.getAccount().then(data => {
          this.account = data;
          return this.account;
        });
      });
  }

  /**
   * Retrieves a list of Acquia applications associated with the authenticated account.
   * The result is cached on the instance.
   *
   * @return {Promise<Array<object>>} A promise that resolves to an array of application objects.
   * Each object contains id, uuid, subuuid, and name.
   */
  getApplications() {
    return this.api.get('/applications').then(res => {
      const total = res.data.total;
      this.applications = total === 0 ? [] : res.data._embedded.items.map(item => ({
        id: item.id,
        uuid: item.uuid,
        subuuid: item.subscription.uuid,
        name: item.hosting ? `${item.name} (${item.hosting.id.split(':')[1]})` : item.name,
      }));
      return this.applications;
    })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Retrieves a list of environments for a given Acquia application.
   *
   * @param {string} appId The ID of the Acquia application.
   * @return {Promise<Array<object>>} A promise that resolves to an array of environment objects.
   * Each object contains name, displayName, git URL, group, PHP version, value (ID), and vcs path.
   */
  getEnvironments(appId) {
    return this.api.get(`/applications/${appId}/environments`).then(res => {
      const total = res.data.total;
      this.environments = [];
      const envs = total === 0 ? [] : res.data._embedded.items;
      _.each(envs, env => {
        const displayName = `${env.label}, ${env.name} (vcs: ${env.vcs.path})`;
        this.environments.push({
          name: env.name,
          displayName,
          git: env.vcs.url,
          group: env.ssh_url.split('.')[0],
          php: env.configuration.php.version,
          value: env.id,
          vcs: env.vcs.path,
        });
      });
      return this.environments;
    })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Retrieves the account details for the authenticated user.
   * The result is cached on the instance. This method is typically called by `auth()`.
   *
   * @return {Promise<object>} A promise that resolves to the account object.
   */
  getAccount() {
    return this.api.get('/account').then(res => {
      this.account = res.data;
      return this.account;
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Uploads an SSH public key to the Acquia account.
   * If a key with the same public_key content already exists and starts with the given label,
   * it will not upload a duplicate. If multiple keys with the same starting label exist,
   * it appends a number to the label to ensure uniqueness (e.g., Lando2, Lando3).
   *
   * @param {string} key Path to the public SSH key file.
   * @param {string} [label] Label for the SSH key on Acquia Cloud.
   * @return {Promise<object | undefined>} A promise that resolves with the API response if a new key is posted,
   * or undefined if the key already exists or an error occurs.
   */
  postKey(key, label = 'Lando') {
    // Key Post data
    const postData = {label, public_key: _.trim(fs.readFileSync(key, 'utf8'))};
    // Start by the users keys
    return this.api.get('/account/ssh-keys')
      // Only grab the lando ones
      .then(response => _(_.get(response, 'data._embedded.items', []))
        .filter(key => _.startsWith(key.label, label))
        .value())
      // If we dont have a match lets post the new one
      .then(landoKeys => {
        if (_.isEmpty(_.find(landoKeys, {public_key: postData.public_key}))) {
          postData.label = `${label}${landoKeys.length + 1}`;
          return this.api.post('/account/ssh-keys', postData)
            .catch(err => {
              throw new Error(_.get(err, 'response.data.message', 'Something went wrong posting your key!'));
            });
        }
      });
  }
};
