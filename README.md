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
