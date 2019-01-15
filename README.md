# ZOS Vouching Mock

Sets up a local ganache node with the Zeppelin OS Vouching contracts and mock data.

# Local Usage

Clone the repo and then install deps:

```
$ yarn
```

Copy over .envrc and allow direnv:

```
$ cp .envrc.example .envrc
$ direnv allow
```

Start `ganache-cli`:

```
$ yarn start
```

Take note of the second account (1), and start a new zos session:

```
$ zos session --from 0x62c404c71db462424a09b789ac318ff03830e8fd --expires 7200 --network local
```

If you changed the mnemonic, you should start a zos session using the second account address.

Push out the local contracts:

```
$ zos push
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
