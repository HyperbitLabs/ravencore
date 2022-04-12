export interface Options {
  host?: string;
  port?: string | number;
  user?: string;
  pass?: string;
  protocol?: unknown;
  batchedCalls?: BatchedCall[] | null;
  disableAgent?: boolean;
  rejectUnauthorized?: boolean;
  queue?: number;
}

export interface BatchedCall {
  json_rpc: string
  method: string,
  params: unknown[],
  id: number,
}