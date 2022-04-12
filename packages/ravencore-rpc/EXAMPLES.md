# Examples

See [callspec](src/callspec.ts) for ongoing compilation of RPC commands.

## Get Info

```javascript
import Client from 'ravencore-rpc';

let run = function() {
  let config = {
    protocol: 'http',
    user: 'user',
    pass: 'password',
    host: '127.0.0.1',
    port: '9050',
  };

  let rpc = new Client(config);

  rpc.getInfo((err: any, data: any) => {
    if (err) {
      console.log('err', err);
      return;
    }
    console.log('data', data);
  });
};

run();
```

## Show New Transactions

```javascript
import Client from 'ravencore-rpc';

let run = function() {
    let config = {
    protocol: 'http',
    user: 'user',
    pass: 'password',
    host: '127.0.0.1',
    port: '9050',
  };

  let rpc = new Client(config);

  let txids = [];

  function showNewTransactions() {
    rpc.getRawMemPool(function (err, ret) {
      if (err) {
        console.error(err);
        return setTimeout(showNewTransactions, 10000);
      }

      console.log("ret", ret);

      function batchCall() {
        ret.result.forEach(function (txid) {
          console.log("txid", txid);
          if (txids.indexOf(txid) === -1) {
            rpc.getRawTransaction(txid);
          }
        });
      }

      rpc.batch(batchCall, function (err, rawtxs) {
        if (err) {
          console.error(err);
          return setTimeout(showNewTransactions, 10000);
        }

        rawtxs.map(function (rawtx) {
          let tx = new ravencore.Transaction(rawtx.result);
          console.log("\n\n\n" + tx.id + ":", tx.toObject());
        });

        txids = ret.result;
        setTimeout(showNewTransactions, 2500);
      });
    });
  }

  showNewTransactions();
}

run();
```