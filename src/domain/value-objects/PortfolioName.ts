export class PortfolioName {
    private constructor(private readonly value: string) {
    }

    static fromString(value: string): PortfolioName {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('Portfolio name must not be empty');
        }

        return new PortfolioName(trimmed);
    }

    toString(): string {
        return this.value;
    }
}
