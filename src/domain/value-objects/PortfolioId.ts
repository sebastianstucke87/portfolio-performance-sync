export class PortfolioId {
    private constructor(private readonly value: string) {
    }

    static fromString(value: string): PortfolioId {
        const trimmed = value.trim();

        if (trimmed.length === 0) {
            throw new Error('Portfolio ID must not be empty');
        }

        return new PortfolioId(trimmed);
    }

    toString(): string {
        return this.value;
    }
}
