export interface TransactionResponseDto {
    id: string;
    currency: string;
    type: 'SECURITY_TRANSACTION' | 'NON_TRADE_SECURITY_TRANSACTION' | 'CASH_TRANSACTION';
    status: string;
    isCancellation: boolean;
    lastEventDateTime: string;
    description: string;

    // SECURITY_TRANSACTION fields
    securityTransactionType?: string;
    quantity?: number;
    amount: number;
    side?: 'BUY' | 'SELL';
    isin?: string;

    // NON_TRADE_SECURITY_TRANSACTION fields
    nonTradeSecurityTransactionType?: string;

    // CASH_TRANSACTION fields
    cashTransactionType?: string;
    relatedIsin?: string;
}
