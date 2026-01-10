export class TransactionDate {
    private constructor(private readonly date: Date) {
    }

    static create(isoString: string): TransactionDate {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date: "${isoString}"`);
        }

        return new TransactionDate(date);
    }

    formatForCsv(): string {
        const year = this.date.getFullYear();
        const month = String(this.date.getMonth() + 1).padStart(2, '0');
        const day = String(this.date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    equals(other: TransactionDate): boolean {
        return this.date.getTime() === other.date.getTime();
    }
}
