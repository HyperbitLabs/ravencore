import ravencore from 'ravencore-lib';
import unorm from 'unorm';
import { words } from './words';
import { errors, pbkdf2, isString } from './utils';

const { BN, Hash, Random } = ravencore.crypto;
const $ = ravencore.util.preconditions;
const DEFAULT_ENT = 128;

export type Data = Buffer | number | string | string[] | null;
export type WordList = string[] | null | undefined;

export type MnemonicType = {
  (this: any, data: Data, wordlist?: WordList): any;
  _belongsToWordlist: (x: string, y: string[]) => boolean;
  _entropy2mnemonic: (x: Buffer, y: string[]) => string;
  _entropyChecksum: (x: Buffer) => string;
  _getDictionary: (x?: string) => string[] | null;
  _mnemonic: (x: number, y: string[]) => string;
  fromSeed: (x: Buffer, y: string[]) => never | MnemonicType;
  isValid: (x: string, y: string[] | null) => boolean;
  phrase: string | undefined;
  Words: Record<string, string[]>;
  prototype?: any;
};

/**
 * 
 * @example
 * // returns natal hada sutil año sólido papel jamón combate aula flota ver esfera...
 * const code = new Mnemonic(Mnemonic.Words.SPANISH);
 * code.toString();
 * 
 * @param data 
 * @param wordlist 
 * @returns 
 */
export const Mnemonic: MnemonicType = function(
  data: Data,
  wordlist: WordList = null
) {
  if (!(this instanceof Mnemonic)) {
    return new (Mnemonic as any)(data, wordlist);
  }

  if (Array.isArray(data)) {
    wordlist = data as string[];
    data = null;
  }

  let seed: Buffer | undefined;
  let ent: number = DEFAULT_ENT;
  let phrase: string | undefined;

  if (Buffer.isBuffer(data)) {
    seed = data;
    ent = seed.length * 8;
  } else if (isString(data)) {
    phrase = unorm.nfkd(data);
  } else if (typeof data === 'number') {
    ent = data;
  } else if (data) {
    throw new ravencore.errors.InvalidArgument(
      'data',
      'Must be a Buffer, a string or an integer'
    );
  }

  wordlist = wordlist || Mnemonic._getDictionary(phrase);
  // expect: string[] | null

  if (phrase && !wordlist) {
    throw new errors.UnknownWordlist(phrase);
  }

  wordlist = wordlist || words.ENGLISH;
  // expect: string[]

  if (seed) {
    phrase = Mnemonic._entropy2mnemonic(seed, wordlist);
  }

  if (phrase && !Mnemonic.isValid(phrase, wordlist)) {
    throw new errors.InvalidMnemonic(phrase);
  }

  if (ent % 32 !== 0 || ent < 128 || ent > 256) {
    throw new ravencore.errors.InvalidArgument(
      'ENT',
      'Values must be ENT > 128 and ENT < 256 and ENT % 32 == 0'
    );
  }

  phrase = phrase || Mnemonic._mnemonic(ent, wordlist);

  // this fixes spacing in JP
  phrase = unorm.nfkd(phrase);

  Object.defineProperty(this, 'wordlist', {
    configurable: false,
    value: wordlist,
  });

  Object.defineProperty(this, 'phrase', {
    configurable: false,
    value: phrase,
  });
};

/**
 * Internal function to detect the wordlist used to generate the mnemonic.
 *
 * @param {string | undefined} mnemonic - The mnemonic string
 * @returns {string[] | null} the wordlist or null
 */
Mnemonic._getDictionary = function(mnemonic?: string): string[] | null {
  if (!mnemonic) {
    return null;
  }

  const dicts = Object.keys(words);

  for (let i = 0; i < dicts.length; i++) {
    const key = dicts[i];
    if (this._belongsToWordlist(mnemonic, words[key])) {
      return words[key];
    }
  }

  return null;
};

/**
 * Internal function to check if a mnemonic belongs to a wordlist.
 *
 * @param {string} mnemonic - The mnemonic string
 * @param {string} wordlist - The wordlist
 * @returns {boolean}
 */
Mnemonic._belongsToWordlist = function(
  mnemonic: string,
  wordlist: string[]
): boolean {
  const words = unorm.nfkd(mnemonic).split(' ');
  for (let i = 0; i < words.length; i++) {
    const ind = wordlist.indexOf(words[i]);
    if (ind < 0) {
      return false;
    }
  }
  return true;
};

/**
 * Internal function to create checksum of entropy
 *
 * @param {Buffer} entropy
 * @returns {string} Checksum of entropy length / 32
 * @private Checksum
 */
Mnemonic._entropyChecksum = function(entropy: Buffer): string {
  var hash = Hash.sha256(entropy);
  var bits = entropy.length * 8;
  var cs = bits / 32;

  var hashbits = new BN(hash.toString('hex'), 16).toString(2);

  // zero pad the hash bits
  while (hashbits.length % 256 !== 0) {
    hashbits = '0' + hashbits;
  }

  var checksum = hashbits.slice(0, cs);

  return checksum;
};

/**
 * Internal function to generate a random mnemonic
 *
 * @param {number} ENT - Entropy size, defaults to 128
 * @param {string[]} wordlist - Array of words to generate the mnemonic
 * @returns {string} Mnemonic string
 */
Mnemonic._mnemonic = function(ENT: number, wordlist: string[]): string {
  var buf = Random.getRandomBuffer(ENT / 8);
  return this._entropy2mnemonic(buf, wordlist);
};

/**
 * Internal function to generate mnemonic based on entropy
 *
 * @param {Buffer} entropy - Entropy buffer
 * @param {string[]} wordlist - Array of words to generate the mnemonic
 * @returns {string} Mnemonic string
 */
Mnemonic._entropy2mnemonic = function(
  entropy: Buffer,
  wordlist: string[]
): string {
  let bin = '';

  for (let i = 0; i < entropy.length; i++) {
    bin = bin + ('00000000' + entropy[i].toString(2)).slice(-8);
  }

  bin = bin + this._entropyChecksum(entropy);

  if (bin.length % 11 !== 0) {
    throw new errors.InvalidEntropy(bin);
  }

  const mnemonic = [];

  for (let j = 0; j < bin.length; j++) {
    const wordIndex = parseInt(bin.slice(j * 11, (j + 1) * 11), 2);
    mnemonic.push(wordlist[wordIndex]);
  }

  let ret;

  if (wordlist === words.JAPANESE) {
    ret = mnemonic.join('\u3000');
  } else {
    ret = mnemonic.join(' ');
  }

  return ret;
};

Mnemonic.phrase = undefined;

Mnemonic.Words = words;

/**
 * Return a boolean if the mnemonic is valid
 *
 * @example
 * // returns true
 * const valid = Mnemonic.isValid('lab rescue lunch elbow recall phrase perfect donkey biology guess moment husband');
 *
 * @param {string} mnemonic - The mnemonic string
 * @param {string[]} wordlist - The wordlist used
 * @returns {boolean}
 */
Mnemonic.isValid = function(
  mnemonic: string,
  wordlist: string[] | null
): boolean {
  mnemonic = unorm.nfkd(mnemonic);
  wordlist = wordlist || this._getDictionary(mnemonic);

  if (!wordlist) {
    return false;
  }

  const words = mnemonic.split(' ');

  let bin = '';

  for (let i = 0; i < words.length; i++) {
    const ind = wordlist.indexOf(words[i]);
    if (ind < 0) {
      return false;
    }
    bin = bin + ('00000000000' + ind.toString(2)).slice(-11);
  }

  const cs = bin.length / 33;
  const hash_bits = bin.slice(-cs);
  const nonhash_bits = bin.slice(0, bin.length - cs);
  const buf = Buffer.alloc(nonhash_bits.length / 8);

  for (let j = 0; j < nonhash_bits.length / 8; j++) {
    buf.writeUInt8(parseInt(bin.slice(j * 8, (j + 1) * 8), 2), j);
  }

  const expected_hash_bits = this._entropyChecksum(buf);

  return expected_hash_bits === hash_bits;
};

/**
 * Generate a seed based on the mnemonic and optional passphrase.
 * 
 * @param {string} - Passphrase
 * @returns {Buffer}
 */
Mnemonic.prototype.toSeed = function(passphrase: string = ''): Buffer {
  return pbkdf2(
    unorm.nfkd(this.phrase),
    unorm.nfkd('mnemonic' + passphrase),
    2048,
    64
  );
};

/**
 * Generate a mnemonic object from seed and wordlist.
 *
 * @param {Buffer} seed
 * @param {string[]} wordlist - Array of words to generate the mnemonic
 * @returns {Mnemonic}
 */
Mnemonic.fromSeed = function(
  seed: Buffer,
  wordlist: string[]
): never | MnemonicType {
  $.checkArgument(Buffer.isBuffer(seed), 'seed must be a Buffer.');
  $.checkArgument(
    Array.isArray(wordlist) || isString(wordlist),
    'wordlist must be a string or an array.'
  );
  return new (Mnemonic as any)(seed, wordlist);
};

/**
 *
 * Generates a HD Private Key from a mnemonic.
 * Optionally receive a passphrase and ravencoin network.
 *
 * @param {string} passphrase - Passphrase
 * @param {Network | string | number} network - The network: 'livenet' or 'testnet'
 * @returns {HDPrivateKey}
 */
Mnemonic.prototype.toHDPrivateKey = function(
  passphrase: string,
  network: unknown
): unknown {
  var seed = this.toSeed(passphrase);
  return ravencore.HDPrivateKey.fromSeed(seed, network);
};

/**
 * Return a the string representation of the mnemonic
 *
 * @returns {string} Mnemonic
 */
Mnemonic.prototype.toString = function(): string {
  return this.phrase;
};

/**
 * Return a string formatted for the console
 *
 * @returns {string} Mnemonic
 */
Mnemonic.prototype.inspect = function(): string {
  return `<Mnemonic: ${this.toString()} >`;
};
