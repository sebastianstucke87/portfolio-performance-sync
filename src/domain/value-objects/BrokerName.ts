export class BrokerName {
    private constructor(private readonly value: string) {
    }

    static fromString(value: string): BrokerName {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('Broker name must not be empty');
        }

        return new BrokerName(trimmed);
    }

    toString(): string {
        return this.value;
    }
}
