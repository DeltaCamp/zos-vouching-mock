# zOS Vouching Mock

Sets up a local ganache node with the Zeppelin OS Vouching contracts and mock data.  In support of [zeppelin-vouching-app](https://github.com/DeltaCamp/zeppelin-vouching-app) and [zos-vouching](https://github.com/zeppelinos/zos-vouching)

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

Start a new zos session:

```
$ zos session --from 0x51f595ef681c3b3b6b6949fbbb36b7d98daa15bf --expires 7200 --network local
```

If you changed the mnemonic, you should replace the above 'from' parameter with another address (I use the second address listed when `ganache-cli` starts).

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


# Deploying to Ropsten

```
zos push --network ropsten --from <admin address>
yarn migrate-ropsten
yarn bootstrap-ropsten
```
