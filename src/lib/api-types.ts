export interface ContractResponse {
  name: string;
  body: string;
}

export interface StxBalance {
  balance: string;
  /**
   * Total STX balance considering pending mempool transactions
   */
  estimated_balance?: string;
  /**
   * Inbound STX balance from pending mempool transactions
   */
  pending_balance_inbound?: string;
  /**
   * Outbound STX balance from pending mempool transactions
   */
  pending_balance_outbound?: string;
  total_sent?: string;
  total_received?: string;
  total_fees_sent?: string;
  total_miner_rewards_received: string;
  /**
   * The transaction where the lock event occurred. Empty if no tokens are locked.
   */
  lock_tx_id: string;
  /**
   * The amount of locked STX, as string quoted micro-STX. Zero if no tokens are locked.
   */
  locked: string;
  /**
   * The STX chain block height of when the lock event occurred. Zero if no tokens are locked.
   */
  lock_height: number;
  /**
   * The burnchain block height of when the lock event occurred. Zero if no tokens are locked.
   */
  burnchain_lock_height: number;
  /**
   * The burnchain block height of when the tokens unlock. Zero if no tokens are locked.
   */
  burnchain_unlock_height: number;
}
