import http from 'http';
import https from 'https';
import async from 'async';
import { Options, BatchedCall } from './iface';

import { callspec } from './callspec';

export class Client {
  [x: string]: any; // Dynamic methods
  host: string;
  port: string | number;
  user: string;
  pass: string;
  protocol: any; // http | https
  batchedCalls: BatchedCall[] | null;
  disableAgent: boolean;
  rejectUnauthorized?: boolean;
  queue: any;
  httpOptions?: any;
  log: any;
  
  constructor(opts: Options) {
    opts = opts || {};
    this.host = opts.host || '127.0.0.1';
    this.port = opts.port || 9050;
    this.user = opts.user || 'user';
    this.pass = opts.pass || 'pass';
    this.protocol = opts.protocol === 'http' ? http : https;
    this.batchedCalls = null;
    this.disableAgent = opts.disableAgent || false;

    const queueSize = opts.queue || 16;
    const isRejectUnauthorized = typeof opts.rejectUnauthorized !== 'undefined';
    this.rejectUnauthorized = isRejectUnauthorized
      ? opts.rejectUnauthorized
      : true;

    this.queue = async.queue(
      (task: any, callback: any) => task(callback),
      queueSize
    );

    this.generateRPCMethods(callspec);
  }

  private _slice(arr: string[], start?: number, end?: number) {
    return Array.prototype.slice.call(arr, start, end);
  }

  private _getRandomId(): number {
    return Math.floor(Math.random() * 100000);
  }

  public batch(batchCallback: any, resultCallback: any) {
    this.batchedCalls = [];
    batchCallback();
    this._rpc.call(this, this.batchedCalls, resultCallback);
    this.batchedCalls = null;
  }

  private _rpc(req: any, callback: any) {
    const task = (taskCallback: any) => {
      function newCallback() {
        callback.apply(undefined, arguments);
        taskCallback();
      }
      this._innerRpc.call(this, req, newCallback);
    };

    this.queue.push(task);
  }

  _innerRpc(request: any, callback: any) {
    request = JSON.stringify(request);
    const auth = new Buffer(this.user + ':' + this.pass).toString('base64');

    const options: Record<any, any> = {
      host: this.host,
      path: '/',
      method: 'POST',
      port: this.port,
      rejectUnauthorized: this.rejectUnauthorized,
      agent: this.disableAgent ? false : undefined,
    };

    if (this.httpOptions) {
      for (let k in this.httpOptions) {
        options[k] = this.httpOptions[k];
      }
    }

    let called = false;
    const errorMessage = 'Ravencoin JSON-RPC: ';

    const req = this.protocol.request(options, (res: any) => {
      // Todo: Verify scope with 'this'
      let buf = '';
      res.on('data', (data: any) => {
        buf += data;
      });

      res.on('end', () => {
        if (called) {
          return;
        }
        called = true;

        switch (res.statusCode) {
          case 401:
            callback(
              new Error(errorMessage + 'Connection Rejected: 401 Unnauthorized')
            );
            return;
          case 403:
            callback(
              new Error(errorMessage + 'Connection Rejected: 403 Forbidden')
            );
            return;
          case 500:
            if (buf.toString() === 'Work queue depth exceeded') {
              const exceededError = new Error(
                'Ravencoin JSON-RPC: ' + buf.toString()
              );
              res.statusCode = 429; // Too many requests
              callback(exceededError);
            }
            break;
          default:
            break;
        }

        let parsedBuf;
        try {
          parsedBuf = JSON.parse(buf);
        } catch (e) {
          // @ts-ignore
          this.log.err(e.stack);
          this.log.err(buf);
          this.log.err('HTTP Status code:' + res.statusCode);
          const err = new Error(
            // @ts-ignore
            errorMessage + 'Error Parsing JSON: ' + e.message
          );
          callback(err);
          return;
        }

        callback(parsedBuf.error, parsedBuf);
      });
    });

    req.on('error', (e: Error) => {
      const err = new Error(errorMessage + 'Request Error: ' + e.message);
      if (!called) {
        called = true;
        callback(err);
      }
    });

    req.setHeader('Content-Length', request.length);
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Authorization', 'Basic ' + auth);
    req.write(request);
    req.end();
  }

  generateRPCMethods(apiCalls: Record<string, string>) {
    function createRPCMethod(methodName: string, argMap: string[] | any) {
      return function(this: Client) {
        let limit = arguments.length - 1;
        
        if (this.batchedCalls) {
          limit = arguments.length;
        }

        for (let i = 0; i < limit; i++) {
          if (argMap[i]) {
            arguments[i] = argMap[i](arguments[i]);
          }
        }

        if (this.batchedCalls) {
          this.batchedCalls.push({
            json_rpc: '2.0',
            method: methodName,
            // @ts-ignore
            params: this._slice(arguments),
            id: this._getRandomId(),
          });
        } else {
          this._rpc.call(
            this,
            {
              method: methodName,
              // @ts-ignore
              params: this._slice(arguments, 0, arguments.length - 1),
              id: this._getRandomId(),
            },
            arguments[arguments.length - 1]
          );
        }
      };
    }

    const types: Record<string, any> = {
      str: function(arg: any) {
        return arg.toString();
      },
      int: function(arg: any) {
        return parseFloat(arg);
      },
      float: function(arg: any) {
        return parseFloat(arg);
      },
      bool: function(arg: any) {
        return (
          arg === true ||
          arg == '1' ||
          arg == 'true' ||
          arg.toString().toLowerCase() == 'true'
        );
      },
      obj: function(arg: any) {
        if (typeof arg === 'string') {
          return JSON.parse(arg);
        }
        return arg;
      },
      arr: function(arg: any) {
        if (typeof arg === 'string') {
          return JSON.parse(arg);
        }
        return arg;
      },
    };

    for (let k in apiCalls) {
      const spec = apiCalls[k].split(' ');
      for (let i = 0; i < spec.length; i++) {
        if (types[spec[i]]) {
          spec[i] = types[spec[i]];
        } else {
          spec[i] = types.str;
        }
      }
      const methodName = k.toLowerCase();
      // @ts-ignore
      this[k] = createRPCMethod(methodName, spec);
      // @ts-ignore
      this[methodName] = this[k];
    }
  }
}