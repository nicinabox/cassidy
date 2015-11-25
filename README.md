# cassidy

[http://cassidy.nicinabox.com](https://cassidy.nicinabox.com)

A password generator backed by [vault](https://github.com/jcoglan/vault) and grown from [Hatchpass](https://github.com/nicinabox/Hatchpass-BackboneJS).

![](http://i.imgur.com/ggLPzGp.gif)

## About

Cassidy generates passwords based on a service (eg, google.com). Combine this with a passphrase and a key (think salt) and you have very strong, unique passwords. No two are alike, even if you use the same service and password as someone else.

## How it works

Your history and the data to recreate a service password is stored in localStorage. Passwords themselves are never stored or transmitted.

Dropbox syncing of services (using the Datastore API) is also available (https only). Your passphrase IS stored in localStorage using Triple DES and your Key as the salt.

**Cassidy does not protect against physical access to your machine.**

## Todo

* [ ] Add X-Frame-Options to prevent iframing
* [ ] Remove subsequent renders from Generator view to prevent keyboard jump
* [ ] Implement service salt
* [ ] Research KDF more. Perhaps don't store phrase

## Development setup

* npm install
* npm start

## License

MIT (c) 2014 Nic Aitch
