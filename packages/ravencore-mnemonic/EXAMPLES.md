# Examples

## Create Mnemonic Object

```javascript
const code = new Mnemonic(Mnemonic.Words.English);
```

## Get string phrase from Mnemonic Object

```javascript
const code = new Mnemonic(Mnemonic.Words.English);
code.toString();
```

## Check if Mnemonic Object is valid in English

```javascript
const code = new Mnemonic(Mnemonic.Words.English);
const isValid = Mnemonic.isValid(code.toString(), Mnemonic.Words.English)
```

## Generate a seed based on the mnemonic and optional passphrase.

```javascript
const code = new Mnemonic(Mnemonic.Words.English);
const passphrase = '';

const seedBuffer = code.toSeed(passphrase)
```

## Generate a Mnemonic Object from seed and wordlist

```javascript
const seedBuffer = '';

const code = Mnemonic.fromSeed(seedBuffer, Mnemonic.Words.English)
```

## Generates a HD Private Key from a mnemonic

```javascript
const code = new Mnemonic(Mnemonic.Words.English);
const passphrase = '';
const network = 'testnet';

const hdPrivateKey = code.toHDPrivateKey(passphrase, network)
```

## Get word list in English

```javascript
const words = Mnemonic.Words.English
```