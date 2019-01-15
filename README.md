# ZOS Vouching Mock

Sets up a local ganache node with the Zeppelin OS Vouching contracts and mock data.

# Usage

Clone the repo and then install deps:

```
$ yarn
```

Start `ganache-cli`:

```
$ yarn start
```

Push out the local contracts:

```
$ yarn push
```

Migrate the contracts:

```
$ yarn migrate
```

Bootstrap the contract data:

```
$ yarn bootstrap
```

To see what data is bootstrapped, have a look at `scripts/bootstrap.js`
