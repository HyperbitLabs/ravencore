import ravencore from 'ravencore-lib';

export const errors = ravencore.errors.extend({
  name: 'Mnemonic',
  message: 'Internal Error on ravencore-mnemonic module {0}',
  errors: [
    {
      name: 'InvalidEntropy',
      message: 'Entropy length must be an even multiple of 11 bits: {0}',
    },
    {
      name: 'UnknownWordlist',
      message: 'Could not detect the used word list: {0}',
    },
    {
      name: 'InvalidMnemonic',
      message: 'Mnemonic string is invalid: {0}',
    },
  ],
});
