# cassidy

[http://cassidy.nicinabox.com](https://cassidy.nicinabox.com)

A password generator backed by [vault](https://github.com/jcoglan/vault) and grown from [Hatchpass](https://github.com/nicinabox/Hatchpass-BackboneJS).

## About

Cassidy generates passwords based on a service (eg, google.com). Combine this with a passphrase and a key (think salt) and you have very strong, unique passwords. No two are alike, even if you use the same service and password as someone else.

## How it works

Your history and the data to recreate a service password is stored in localStorage. Passwords themselves are never stored or transmitted.

Dropbox syncing of services (using the Datastore API) is also available (https only). Your passphrase IS stored in localStorage using Triple DES and your Key as the salt.

**Cassidy does not protect against physical access to your machine.**

## Development setup

* bundle install
* npm install
* bower install

## License

MIT (c) 2014 Nic Aitch
