export class TransactionType {
    static readonly Buy = new TransactionType('Buy');
    static readonly Sell = new TransactionType('Sell');
    static readonly Dividend = new TransactionType('Dividend');
    static readonly Interest = new TransactionType('Interest');
    static readonly Deposit = new TransactionType('Deposit');
    static readonly Removal = new TransactionType('Removal');
    static readonly Taxes = new TransactionType('Taxes');
    static readonly Fees = new TransactionType('Fees');
    static readonly TransferInbound = new TransactionType('Transfer (Inbound)');
    static readonly TransferOutbound = new TransactionType('Transfer (Outbound)');

    private constructor(private readonly value: string) {
    }

    toString(): string {
        return this.value;
    }

    equals(other: TransactionType): boolean {
        return this.value === other.value;
    }

    isSecurityTransaction(): boolean {
        return (
            this.equals(TransactionType.Buy) ||
            this.equals(TransactionType.Sell) ||
            this.equals(TransactionType.Dividend) ||
            this.equals(TransactionType.TransferInbound) ||
            this.equals(TransactionType.TransferOutbound)
        );
    }
}
