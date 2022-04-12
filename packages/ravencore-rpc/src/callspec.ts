/** https://developer.bitcoin.org/reference/rpc/#generating-rpcs */
/** https://github.com/raven-community/ravencoin-core/blob/master/src/methods.js */

/** TODO: Update rest of commented methods. Document param, returns, etc... */

export const callspec = {
  /** Blockchain RPCs */
  /** ----------------------------------------------------------------- */
  getBestBlockHash: '',
  getBlock: 'str bool',
  getBlockchainInfo: '',
  getBlockCount: '',
  // getblockfilter
  getBlockHash: 'int',
  getBlockHeader: 'str',
  // getblockstats
  getChainTips: '',
  // getchaintxstats
  getDifficulty: '',
  // getmempoolancestors
  // getmempooldescendants
  getMempoolEntry: 'str',
  getMemPoolInfo: '',
  getRawMemPool: '',
  getTxOut: 'str int bool',
  // gettxoutproof
  getTxOutSetInfo: '',
  // preciousblock
  // pruneblockchain
  // savemempool
  // scantxoutset
  // verifychain
  // verifytxoutproof
  /** ----------------------------------------------------------------- */

  /** Control RPCs */
  /** ----------------------------------------------------------------- */
  // getmemoryinfo
  // getrpcinfo
  help: '',
  // logging
  stop: '',
  // uptime
  /** ----------------------------------------------------------------- */

  /** Generating RPCs */
  /** ----------------------------------------------------------------- */
  generate: 'int', // Ravencoin Specific
  // generateblock
  // generatetoaddress
  // generatetodescriptor
  /** ----------------------------------------------------------------- */

  /** Mining RPCs */
  /** ----------------------------------------------------------------- */
  getBlockTemplate: '',
  getMiningInfo: '',
  getNetworkHashps: 'int',
  prioritiseTransaction: 'str float int',
  submitBlock: '',
  // submitheader
  /** ----------------------------------------------------------------- */

  /** Network RPCs */
  /** ----------------------------------------------------------------- */
  addNode: '',
  // clearbanned
  // disconnectnode
  getAddedNodeInfo: '',
  getConnectionCount: '',
  // getnettotals
  getNetworkInfo: '',
  // getnodeaddresses
  getPeerInfo: '',
  // listbanned
  // ping
  // setban
  // setnetworkactive
  /** ----------------------------------------------------------------- */

  /** Rawtransactions RPCs */
  /** ----------------------------------------------------------------- */
  // analyzepsbt
  // combinepsbt
  createRawTransaction: 'arr obj',
  // converttopsbt
  // createpsbt
  // createrawtransaction
  // decodepsbt
  decodeRawTransaction: '',
  // decodescript
  // finalizepsbt
  fundRawTransaction: 'str obj',
  getRawTransaction: 'str int',
  // joinpsbts
  sendRawTransaction: 'str',
  // signrawtransactionwithkey
  // testmempoolaccept
  // utxoupdatepsbt
  /** ----------------------------------------------------------------- */

  /** Util RPCs */
  /** ----------------------------------------------------------------- */
  createMultiSig: '',
  // deriveaddresses
  estimateFee: 'int', // Ravencoin Specific
  estimatePriority: 'int', // Ravencoin Specific
  estimateSmartFee: 'int str',
  // getdescriptorinfo
  // getindexinfo
  // signmessagewithprivkey
  validateAddress: '',
  verifyMessage: '',
  /** ----------------------------------------------------------------- */

  /** Wallet RPCs */
  /** ----------------------------------------------------------------- */
  abandonTransaction: 'str',
  abortRescan: '',
  addMultiSigAddress: '',
  backupWallet: '',
  // bumpfee
  // createwallet
  dumpPrivKey: '',
  // dumpwallet
  encryptWallet: '',
  // getaddressesbylabel
  // getaddressinfo
  getBalance: 'str int',
  // getbalances
  getNewAddress: '',
  // getrawchangeaddress
  getReceivedByAddress: 'str int',
  // getreceivedbylabel
  getTransaction: '',
  // getunconfirmedbalance
  // getwalletinfo
  importAddress: 'str str bool',
  // importdescriptors
  // importmulti
  importPrivKey: 'str str bool',
  // importprunedfunds
  // importpubkey
  // importwallet
  keyPoolRefill: '',
  // listaddressgroupings
  // listlabels
  listLockUnspent: 'bool',
  listReceivedByAddress: 'int bool',
  // listreceivedbylabel
  listSinceBlock: 'str int',
  listTransactions: 'str int int',
  listUnspent: 'int int',
  // listwalletdir
  // listwallets
  // loadwallet
  lockUnspent: '',
  // psbtbumpfee
  // removeprunedfunds
  // rescanblockchain
  // send
  sendMany: 'str obj int str', //not sure this is will work
  sendToAddress: 'str float str str',
  // sethdseed
  // setlabel
  setTxFee: 'float',
  // setwalletflag
  signMessage: '',
  // signrawtransactionwithwallet
  // unloadwallet
  // upgradewallet
  // walletcreatefundedpsbt
  walletLock: '',
  walletPassPhrase: 'string int',
  walletPassphraseChange: '',
  // walletprocesspsbt
  /** ----------------------------------------------------------------- */

  /** Undocumented RPCs*/
  /** ----------------------------------------------------------------- */
  getAccount: '',
  getAssetData: 'str', //"asset_name"
  issue: 'str float str str int bool bool str', //"asset_name" qty "( to_address )" "( change_address )" ( units ) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
  issueUnique: 'str arr arr str str', //issueunique "root_name" [asset_tags] ( [ipfs_hashes] ) "( to_address )" "( change_address )"
  listAddressesByAsset: 'str', //"asset_name"
  listAssetBalancesByAddress: 'str', //"address"
  listAssets: 'str bool int int', //"( asset )" ( verbose ) ( count ) ( start )
  listMyAssets: 'str bool int int', //"( asset )" ( verbose ) ( count ) ( start )
  reissue: 'str float str str bool str', //"asset_name" qty "to_address" "change_address" ( reissuable ) "( new_ipfs )"
  transfer: 'str float str', //"asset_name" qty "to_address"
  isValidVerifierString: 'str', //"verifier_string"
  getVerifierString: 'str', //"restricted_name"
  listAddressesForTag: 'str', //"tag_name"
  listAddressRestrictions: 'str', //"address"
  listGlobalRestrictions: '',
  listTagsForAddress: 'str', //"address"
  addTagToAddress: 'str str', //"tag_name", "to_address",
  removeTagFromAddress: 'str str', //"tag_name", "to_address",
  getAccountAddress: 'str',
  getAddressMempool: 'obj bool',
  getAddressUtxos: 'obj',
  getAddressBalance: 'obj',
  getAddressDeltas: 'obj',
  getAddressTxids: 'obj',
  getAddressesByAccount: '',
  getBlockDeltas: 'str',
  getBlockHashes: 'int int obj',
  getBlockNumber: '',
  getGenerate: '',
  getHashesPerSec: '',
  getInfo: '',
  getMemoryPool: '',
  getReceivedByAccount: 'str int',
  getSpentInfo: 'obj',
  getWork: '',
  invalidateBlock: 'str',
  listAccounts: 'int',
  listAddressGroupings: '',
  listReceivedByAccount: 'int bool',
  move: 'str str float int str',
  sendFrom: 'str str float int str str',
  setAccount: '',
  setGenerate: 'bool int',
  signRawTransaction: 'str arr arr',
};
