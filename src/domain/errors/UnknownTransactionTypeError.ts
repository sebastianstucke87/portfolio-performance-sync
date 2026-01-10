export class UnknownTransactionTypeError extends Error {
    constructor(public readonly rawTransaction: unknown) {
        super(`Unknown transaction type: ${JSON.stringify(rawTransaction)}`);
        this.name = 'UnknownTransactionTypeError';
    }
}
