# JWT Key Auth

JWT Key Auth is an answer to the microservice communication problem: how one microservice can authorize itself in another microservices **without** creating authorization manager service.

`jwt-key-auth` essentialy works similar to how SSH client and SSH server work together. SSH client signes requests with it's private key, and SSH authorizes client with `authorized_keys` public keys list.

## Practical example

1. Developer wants backend service A to authorize in queue service B.
2. Backend service A install `jwt-key-auth`, and so queue service B.
3. Developer creates individual pair of keys for service A.
4. Developer mounts private key in service A, and public key in service B.
5. Developer creates JWT token in service A via `jwt-key-auth`, and sends it to service B.
6. Service B validates received token via `jwt-key-auth`, and authorizes request or rejects it.

## Advantages

`jwt-key-auth` is lightweight, and easy to use addition to any Node app working with another services, maintained as the same group.

It standarizes way how containers authenticate in each other.

Mounting directories with public keys, and mounting single private key to containers is easy and configurable operation performed by  the container. For app it's 100% transparent - it's part of initial configuration.

`jwt-key-auth` doesn't reinvent the wheel - instead it relies on battle-tested JWT tokens, RSA security and SSH-like protocol.

Library allows for different permissions in different services. By mounting one set of public keys in one container, and another set in another one, developer can build complex authorization schemas.

## Installation

`npm install --save jwt-key-auth`

or

`yarn add jwt-key-auth`

## Usage

`jwt-key-auth` primary class is `JwtKeyAuth`, naturally.

Import it by:

`import { JwtKeyAuth } from 'jwt-key-auth';`

Now, `JwtKeyAuth` requires two services: one for JWT logic, and another one for key management. Fortunately, `jwy-key-auth` comes with built-in implementations:

`import { JwsAdapter } from 'jwt-key-auth';`

`import { FileKeyStore } from 'jwt-key-auth';`

Now, register everything:

```js
import { JwtKeyAuth, JwsAdapter, FileKeyStore } from 'jwt-key-auth';

async function createAuthService () {
  const jwtService = new JwsAdapter();
  const keyStore = new FileKeyStore();
  const jwtKeyAuth = new JwtKeyAuth(jwtService, keyStore);

  await keyStore.fill('/absolute/path/to/public/keys');
  await keyStore.addPrivateKeyFile('/absolute/path/to/private/key.pem');

  return jwtKeyAuth;
}
```

(note: instead of using `FileKeyStore`, you may use `KeyStore` which manages key, but requires buffers instead of paths to files).

And now, we can start signing and verifying keys:

```js
import { JwtKeyAuth, JwsAdapter, FileKeyStore } from 'jwt-key-auth';

async function createAuthService () {
  const jwtService = new JwsAdapter();
  const keyStore = new FileKeyStore();
  const jwtKeyAuth = new JwtKeyAuth(jwtService, keyStore);

  await keyStore.fill('/absolute/path/to/public/keys');
  await keyStore.addPrivateKeyFile('/absolute/path/to/private/key.pem');

  return jwtKeyAuth;
}

async function main () {
  const thisServiceName = 'my_name';
  const authService = await createAuthService();

  const receivedToken = '...'
  const myToken = await authService.generate(thisServiceName);
  const tokenVerification = await authService.verify(receivedToken);

  console.log(myToken); // token to send to another services
  console.log(tokenVerification); // true or false, depending if it is correct and if we have public key of the receive that wants to access us
}

main();
```

