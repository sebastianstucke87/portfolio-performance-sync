export class Money {
    private constructor(
        private readonly amount: number,
        private readonly currency: string,
    ) {
    }

    static create(amount: number, currency: string): Money {
        if (!currency || currency.length !== 3) {
            throw new Error(`Invalid currency code: "${currency}". Must be 3 letters (ISO 4217).`);
        }

        return new Money(amount, currency.toUpperCase());
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    isNegative(): boolean {
        return this.amount < 0;
    }

    abs(): Money {
        return new Money(Math.abs(this.amount), this.currency);
    }

    formatForCsv(): string {
        return this.amount.toFixed(2);
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}
