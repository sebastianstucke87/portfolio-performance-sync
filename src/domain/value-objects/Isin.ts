export class Isin {
    private constructor(private readonly value: string) {
    }

    static create(raw: string): Isin {
        const cleaned = raw.trim().toUpperCase();

        if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(cleaned)) {
            throw new Error(`Invalid ISIN: "${raw}"`);
        }

        return new Isin(cleaned);
    }

    toString(): string {
        return this.value;
    }

    equals(other: Isin): boolean {
        return this.value === other.value;
    }
}
