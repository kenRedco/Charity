import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Network = 'ETH' | 'BTC' | 'SOL' | 'TRX' | 'XRP';
type VerificationStatus = 'pending' | 'verified';
type JsonRecord = Record<string, unknown>;

interface VerifiedTransfer {
  status: VerificationStatus;
  amount: string | null;
  recipient: string | null;
  confirmedAt: string | null;
  explorerUrl: string;
}

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const EXPLORERS: Record<Network, string> = {
  ETH: 'https://etherscan.io/tx/',
  BTC: 'https://mempool.space/tx/',
  SOL: 'https://explorer.solana.com/tx/',
  TRX: 'https://tronscan.org/#/transaction/',
  XRP: 'https://livenet.xrpl.org/transactions/',
};

const DECIMALS: Record<Network, number> = {
  ETH: 18,
  BTC: 8,
  SOL: 9,
  TRX: 6,
  XRP: 6,
};

class RequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function response(body: JsonRecord, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
  });
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new RequestError(`Server configuration is missing ${name}.`, 503);
  return value;
}

function normalizeHash(network: Network, hash: string) {
  return network === 'SOL' ? hash : hash.toLowerCase();
}

function validHash(network: Network, hash: string) {
  const patterns: Record<Network, RegExp> = {
    ETH: /^0x[a-fA-F0-9]{64}$/,
    BTC: /^[a-fA-F0-9]{64}$/,
    SOL: /^[1-9A-HJ-NP-Za-km-z]{87,88}$/,
    TRX: /^[a-fA-F0-9]{64}$/,
    XRP: /^[a-fA-F0-9]{64}$/,
  };
  return patterns[network].test(hash);
}

function decimalAmount(units: bigint, decimals: number) {
  const scale = 10n ** BigInt(decimals);
  const whole = units / scale;
  const fraction = (units % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

async function postJson(url: string, body: unknown, headers: HeadersInit = {}) {
  const result = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
  if (!result.ok)
    throw new RequestError('The blockchain network could not be reached. Try again shortly.', 502);
  const json: unknown = await result.json();
  if (!isRecord(json))
    throw new RequestError('The blockchain network returned an invalid response.', 502);
  if (json.error)
    throw new RequestError('The blockchain network rejected the verification request.', 502);
  return json;
}

async function getJson(url: string, headers: HeadersInit = {}) {
  const result = await fetch(url, { headers, signal: AbortSignal.timeout(12000) });
  if (result.status === 404) return null;
  if (!result.ok)
    throw new RequestError('The blockchain network could not be reached. Try again shortly.', 502);
  const json: unknown = await result.json();
  if (!isRecord(json))
    throw new RequestError('The blockchain network returned an invalid response.', 502);
  return json;
}

async function verifyEthereum(hash: string): Promise<VerifiedTransfer> {
  const recipient = requiredEnv('DONATION_ETH_ADDRESS');
  const rpcUrl = Deno.env.get('ETH_RPC_URL')?.trim() || 'https://ethereum-rpc.publicnode.com';
  const chainResponse = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 0,
    method: 'eth_chainId',
    params: [],
  });
  if (chainResponse.result !== '0x1')
    throw new RequestError('The configured Ethereum RPC is not on Ethereum mainnet.', 503);
  const txResponse = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getTransactionByHash',
    params: [hash],
  });
  const tx = isRecord(txResponse.result) ? txResponse.result : null;
  if (!tx)
    return {
      status: 'pending',
      amount: null,
      recipient: null,
      confirmedAt: null,
      explorerUrl: EXPLORERS.ETH + hash,
    };
  if (
    typeof tx.to !== 'string' ||
    tx.to.toLowerCase() !== recipient.toLowerCase() ||
    tx.input !== '0x'
  ) {
    throw new RequestError(
      'This transaction is not a direct ETH donation to the configured wallet.',
      422
    );
  }
  if (typeof tx.value !== 'string' || !/^0x[0-9a-f]+$/i.test(tx.value)) {
    throw new RequestError('The transaction amount could not be verified.', 422);
  }
  const amount = decimalAmount(BigInt(tx.value), DECIMALS.ETH);
  const receiptResponse = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 2,
    method: 'eth_getTransactionReceipt',
    params: [hash],
  });
  const receipt = isRecord(receiptResponse.result) ? receiptResponse.result : null;
  if (!receipt)
    return {
      status: 'pending',
      amount,
      recipient,
      confirmedAt: null,
      explorerUrl: EXPLORERS.ETH + hash,
    };
  if (receipt.status !== '0x1')
    throw new RequestError('The transaction did not succeed on Ethereum.', 422);

  const latestResponse = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 3,
    method: 'eth_blockNumber',
    params: [],
  });
  const latest = typeof latestResponse.result === 'string' ? BigInt(latestResponse.result) : 0n;
  const blockNumber = typeof receipt.blockNumber === 'string' ? BigInt(receipt.blockNumber) : 0n;
  if (!blockNumber || latest - blockNumber < 11n) {
    return {
      status: 'pending',
      amount,
      recipient,
      confirmedAt: null,
      explorerUrl: EXPLORERS.ETH + hash,
    };
  }
  const blockResponse = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 4,
    method: 'eth_getBlockByNumber',
    params: [receipt.blockNumber, false],
  });
  const block = isRecord(blockResponse.result) ? blockResponse.result : null;
  const timestamp =
    block && typeof block.timestamp === 'string' ? Number(BigInt(block.timestamp)) : NaN;
  if (!Number.isFinite(timestamp))
    throw new RequestError('The confirmed block timestamp could not be verified.', 502);
  return {
    status: 'verified',
    amount,
    recipient,
    confirmedAt: new Date(timestamp * 1000).toISOString(),
    explorerUrl: EXPLORERS.ETH + hash,
  };
}

async function verifyBitcoin(hash: string): Promise<VerifiedTransfer> {
  const recipient = requiredEnv('DONATION_BTC_ADDRESS');
  const tx = await getJson(`https://mempool.space/api/tx/${encodeURIComponent(hash)}`);
  if (!tx)
    return {
      status: 'pending',
      amount: null,
      recipient: null,
      confirmedAt: null,
      explorerUrl: EXPLORERS.BTC + hash,
    };
  if (tx.txid !== hash.toLowerCase() || !Array.isArray(tx.vout)) {
    throw new RequestError('The Bitcoin transaction could not be verified.', 422);
  }
  let sats = 0n;
  for (const output of tx.vout) {
    if (!isRecord(output) || output.scriptpubkey_address !== recipient) continue;
    if (
      typeof output.value !== 'number' ||
      !Number.isSafeInteger(output.value) ||
      output.value <= 0
    ) {
      throw new RequestError('The Bitcoin transfer amount could not be verified.', 422);
    }
    sats += BigInt(output.value);
  }
  if (sats === 0n)
    throw new RequestError(
      'This transaction does not pay the configured Bitcoin donation address.',
      422
    );
  const status = isRecord(tx.status) ? tx.status : null;
  if (!status?.confirmed) {
    return {
      status: 'pending',
      amount: decimalAmount(sats, DECIMALS.BTC),
      recipient,
      confirmedAt: null,
      explorerUrl: EXPLORERS.BTC + hash,
    };
  }
  if (typeof status.block_time !== 'number')
    throw new RequestError('The Bitcoin confirmation time could not be verified.', 502);
  return {
    status: 'verified',
    amount: decimalAmount(sats, DECIMALS.BTC),
    recipient,
    confirmedAt: new Date(status.block_time * 1000).toISOString(),
    explorerUrl: EXPLORERS.BTC + hash,
  };
}

function solanaTransferInstructions(transaction: JsonRecord, meta: JsonRecord, recipient: string) {
  const message = isRecord(transaction.message) ? transaction.message : null;
  const instructions =
    message && Array.isArray(message.instructions) ? [...message.instructions] : [];
  if (Array.isArray(meta.innerInstructions)) {
    for (const group of meta.innerInstructions) {
      if (isRecord(group) && Array.isArray(group.instructions))
        instructions.push(...group.instructions);
    }
  }
  let lamports = 0n;
  for (const instruction of instructions) {
    if (!isRecord(instruction) || instruction.program !== 'system' || !isRecord(instruction.parsed))
      continue;
    if (instruction.parsed.type !== 'transfer' || !isRecord(instruction.parsed.info)) continue;
    const info = instruction.parsed.info;
    if (
      info.destination !== recipient ||
      (typeof info.lamports !== 'string' && typeof info.lamports !== 'number')
    )
      continue;
    const amount = BigInt(info.lamports);
    if (amount > 0n) lamports += amount;
  }
  return lamports;
}

async function verifySolana(hash: string): Promise<VerifiedTransfer> {
  const recipient = requiredEnv('DONATION_SOL_ADDRESS');
  const rpcUrl = Deno.env.get('SOL_RPC_URL')?.trim() || 'https://api.mainnet-beta.solana.com';
  const genesis = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 0,
    method: 'getGenesisHash',
    params: [],
  });
  if (genesis.result !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') {
    throw new RequestError('The configured Solana RPC is not on Solana mainnet.', 503);
  }
  const rpc = await postJson(rpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransaction',
    params: [
      hash,
      { commitment: 'finalized', encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 },
    ],
  });
  const result = isRecord(rpc.result) ? rpc.result : null;
  if (!result)
    return {
      status: 'pending',
      amount: null,
      recipient: null,
      confirmedAt: null,
      explorerUrl: EXPLORERS.SOL + hash,
    };
  const transaction = isRecord(result.transaction) ? result.transaction : null;
  const meta = isRecord(result.meta) ? result.meta : null;
  const signatures =
    transaction && Array.isArray(transaction.signatures) ? transaction.signatures : [];
  if (!transaction || !meta || signatures[0] !== hash)
    throw new RequestError('The Solana transaction could not be verified.', 422);
  if (meta.err !== null) throw new RequestError('The Solana transaction did not succeed.', 422);
  const lamports = solanaTransferInstructions(transaction, meta, recipient);
  if (!lamports)
    throw new RequestError(
      'This transaction does not pay the configured Solana donation address.',
      422
    );
  if (typeof result.blockTime !== 'number')
    throw new RequestError('The finalized Solana block time could not be verified.', 502);
  return {
    status: 'verified',
    amount: decimalAmount(lamports, DECIMALS.SOL),
    recipient,
    confirmedAt: new Date(result.blockTime * 1000).toISOString(),
    explorerUrl: EXPLORERS.SOL + hash,
  };
}

function base58AddressToHex(address: string) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let value = 0n;
  for (const character of address) {
    const digit = alphabet.indexOf(character);
    if (digit < 0) throw new RequestError('The configured TRON wallet address is invalid.', 503);
    value = value * 58n + BigInt(digit);
  }
  let hex = value.toString(16);
  if (hex.length % 2) hex = `0${hex}`;
  for (const character of address) {
    if (character !== '1') break;
    hex = `00${hex}`;
  }
  if (hex.length !== 50)
    throw new RequestError('The configured TRON wallet address is invalid.', 503);
  return hex.slice(0, 42).toLowerCase();
}

async function verifyTron(hash: string): Promise<VerifiedTransfer> {
  const recipient = requiredEnv('DONATION_TRX_ADDRESS');
  const rpcUrl = Deno.env.get('TRON_RPC_URL')?.trim() || 'https://api.trongrid.io';
  const apiKey = Deno.env.get('TRON_API_KEY')?.trim();
  const headers = apiKey ? { 'TRON-PRO-API-KEY': apiKey } : {};
  const tx = await postJson(`${rpcUrl}/wallet/gettransactionbyid`, { value: hash }, headers);
  if (!tx.txID)
    return {
      status: 'pending',
      amount: null,
      recipient: null,
      confirmedAt: null,
      explorerUrl: EXPLORERS.TRX + hash,
    };
  const rawData = isRecord(tx.raw_data) ? tx.raw_data : null;
  const contracts = rawData && Array.isArray(rawData.contract) ? rawData.contract : [];
  const transfer = contracts.find(
    (contract) =>
      isRecord(contract) &&
      contract.type === 'TransferContract' &&
      isRecord(contract.parameter) &&
      isRecord(contract.parameter.value)
  );
  if (!isRecord(transfer) || !isRecord(transfer.parameter) || !isRecord(transfer.parameter.value)) {
    throw new RequestError('This is not a direct TRX transfer.', 422);
  }
  const value = transfer.parameter.value;
  if (
    typeof value.to_address !== 'string' ||
    value.to_address.toLowerCase() !== base58AddressToHex(recipient)
  ) {
    throw new RequestError(
      'This transaction does not pay the configured TRON donation address.',
      422
    );
  }
  if (
    typeof value.amount !== 'number' ||
    !Number.isSafeInteger(value.amount) ||
    value.amount <= 0
  ) {
    throw new RequestError('The TRON transfer amount could not be verified.', 422);
  }
  const infoResponse = await postJson(
    `${rpcUrl}/wallet/gettransactioninfobyid`,
    { value: hash },
    headers
  );
  if (!infoResponse.blockNumber || !isRecord(infoResponse.receipt)) {
    return {
      status: 'pending',
      amount: decimalAmount(BigInt(value.amount), DECIMALS.TRX),
      recipient,
      confirmedAt: null,
      explorerUrl: EXPLORERS.TRX + hash,
    };
  }
  if (
    infoResponse.receipt.result !== 'SUCCESS' ||
    typeof infoResponse.blockTimeStamp !== 'number'
  ) {
    throw new RequestError('The TRON transaction did not succeed.', 422);
  }
  return {
    status: 'verified',
    amount: decimalAmount(BigInt(value.amount), DECIMALS.TRX),
    recipient,
    confirmedAt: new Date(infoResponse.blockTimeStamp).toISOString(),
    explorerUrl: EXPLORERS.TRX + hash,
  };
}

async function verifyXrp(hash: string): Promise<VerifiedTransfer> {
  const recipient = requiredEnv('DONATION_XRP_ADDRESS');
  const rpcUrl = Deno.env.get('XRP_RPC_URL')?.trim() || 'https://xrplcluster.com/';
  const rpc = await postJson(rpcUrl, {
    method: 'tx',
    params: [{ transaction: hash, binary: false }],
  });
  const result = isRecord(rpc.result) ? rpc.result : null;
  if (!result || result.error === 'txnNotFound') {
    return {
      status: 'pending',
      amount: null,
      recipient: null,
      confirmedAt: null,
      explorerUrl: EXPLORERS.XRP + hash,
    };
  }
  const tx = isRecord(result.tx_json) ? result.tx_json : result;
  const meta = isRecord(result.meta) ? result.meta : null;
  const returnedHash = typeof tx.hash === 'string' ? tx.hash : result.hash;
  if (returnedHash !== hash.toUpperCase() && returnedHash !== hash)
    throw new RequestError('The XRP transaction could not be verified.', 422);
  if (tx.TransactionType !== 'Payment' || tx.Destination !== recipient) {
    throw new RequestError(
      'This transaction does not pay the configured XRP donation address.',
      422
    );
  }
  if (result.validated !== true || !meta) {
    return {
      status: 'pending',
      amount: null,
      recipient,
      confirmedAt: null,
      explorerUrl: EXPLORERS.XRP + hash,
    };
  }
  if (meta.TransactionResult !== 'tesSUCCESS')
    throw new RequestError('The XRP transaction did not succeed.', 422);
  const delivered = typeof meta.delivered_amount === 'string' ? meta.delivered_amount : tx.Amount;
  if (typeof delivered !== 'string' || !/^\d+$/.test(delivered) || BigInt(delivered) <= 0n) {
    throw new RequestError('Only native XRP payments can be verified as donations.', 422);
  }
  const ledgerIndex = typeof result.ledger_index === 'number' ? result.ledger_index : null;
  if (ledgerIndex === null)
    throw new RequestError('The validated XRP ledger index could not be verified.', 502);
  const ledger = await postJson(rpcUrl, {
    method: 'ledger',
    params: [{ ledger_index: ledgerIndex, transactions: false, expand: false }],
  });
  const ledgerResult = isRecord(ledger.result) ? ledger.result : null;
  const ledgerObject = ledgerResult && isRecord(ledgerResult.ledger) ? ledgerResult.ledger : null;
  const closeTime = ledgerObject?.close_time;
  if (typeof closeTime !== 'number')
    throw new RequestError('The XRP confirmation time could not be verified.', 502);
  const rippleEpoch = 946684800;
  return {
    status: 'verified',
    amount: decimalAmount(BigInt(delivered), DECIMALS.XRP),
    recipient,
    confirmedAt: new Date((closeTime + rippleEpoch) * 1000).toISOString(),
    explorerUrl: EXPLORERS.XRP + hash,
  };
}

async function verifyTransfer(network: Network, hash: string) {
  switch (network) {
    case 'ETH':
      return verifyEthereum(hash);
    case 'BTC':
      return verifyBitcoin(hash);
    case 'SOL':
      return verifySolana(hash);
    case 'TRX':
      return verifyTron(hash);
    case 'XRP':
      return verifyXrp(hash);
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin');
  const allowedOrigins = (Deno.env.get('APP_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers:
        origin && allowedOrigins.includes(origin)
          ? { ...corsHeaders, 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
          : corsHeaders,
    });
  }
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405, null);
  if (!origin || !allowedOrigins.includes(origin))
    return response({ error: 'Origin not allowed.' }, 403, null);

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new RequestError('Sign in before saving a donation.', 401);
    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const anonKey = requiredEnv('SUPABASE_ANON_KEY');
    const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user)
      throw new RequestError('Your session expired. Sign in again.', 401);

    const payload: unknown = await request.json();
    if (
      !isRecord(payload) ||
      typeof payload.network !== 'string' ||
      typeof payload.txHash !== 'string'
    ) {
      throw new RequestError('Provide a supported network and transaction hash.', 400);
    }
    const network = payload.network as Network;
    if (
      !['ETH', 'BTC', 'SOL', 'TRX', 'XRP'].includes(network) ||
      !validHash(network, payload.txHash)
    ) {
      throw new RequestError('The network or transaction hash is invalid.', 400);
    }
    if (typeof payload.isAnonymous !== 'boolean')
      throw new RequestError('Choose whether this donation is anonymous.', 400);
    if (
      payload.projectId !== undefined &&
      payload.projectId !== null &&
      (typeof payload.projectId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          payload.projectId
        ))
    ) {
      throw new RequestError('The selected project is invalid.', 400);
    }

    const hash = normalizeHash(network, payload.txHash);
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: existing, error: lookupError } = await adminClient
      .from('donations')
      .select(
        'id,user_id,project_id,verification_status,network,transaction_hash,symbol,amount,recipient_address,confirmed_at,explorer_url,is_anonymous'
      )
      .eq('network', network)
      .eq('transaction_hash', hash)
      .maybeSingle();
    if (lookupError) throw new RequestError('Could not securely load the donation record.', 500);
    if (existing && existing.user_id !== userData.user.id) {
      throw new RequestError('This transaction is already linked to an account.', 409);
    }
    if (existing?.verification_status === 'verified') {
      return response(
        {
          donation: {
            network: existing.network,
            transaction_hash: existing.transaction_hash,
            symbol: existing.symbol,
            amount: existing.amount,
            recipient_address: existing.recipient_address,
            verification_status: existing.verification_status,
            confirmed_at: existing.confirmed_at,
            explorer_url: existing.explorer_url,
            is_anonymous: existing.is_anonymous,
          },
        },
        200,
        origin
      );
    }
    const projectId =
      typeof payload.projectId === 'string' ? payload.projectId : (existing?.project_id ?? null);
    if (projectId && projectId !== existing?.project_id) {
      const { data: project, error: projectError } = await adminClient
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('is_active', true)
        .maybeSingle();
      if (projectError) throw new RequestError('Could not validate the selected project.', 500);
      if (!project) throw new RequestError('The selected project is no longer available.', 422);
    }
    const transfer = await verifyTransfer(network, hash);

    const donationValues = {
      user_id: userData.user.id,
      project_id: projectId,
      network,
      transaction_hash: hash,
      symbol: network,
      amount: transfer.amount,
      recipient_address: transfer.recipient,
      verification_status: transfer.status,
      confirmed_at: transfer.confirmedAt,
      explorer_url: transfer.explorerUrl,
      is_anonymous: payload.isAnonymous,
    };
    const write = existing
      ? await adminClient
          .from('donations')
          .update(donationValues)
          .eq('id', existing.id)
          .eq('user_id', userData.user.id)
          .select(
            'id,network,transaction_hash,symbol,amount,recipient_address,verification_status,confirmed_at,explorer_url,is_anonymous'
          )
          .single()
      : await adminClient
          .from('donations')
          .insert(donationValues)
          .select(
            'id,network,transaction_hash,symbol,amount,recipient_address,verification_status,confirmed_at,explorer_url,is_anonymous'
          )
          .single();
    if (write.error) {
      if (write.error.code === '23505')
        throw new RequestError('This transaction is already linked to an account.', 409);
      throw new RequestError('Could not save the verified donation.', 500);
    }
    return response({ donation: write.data }, transfer.status === 'verified' ? 200 : 202, origin);
  } catch (error) {
    if (error instanceof RequestError)
      return response({ error: error.message }, error.status, origin);
    console.error('Donation verification failed:', error);
    return response(
      { error: 'The transaction could not be verified right now. Please try again.' },
      502,
      origin
    );
  }
});
