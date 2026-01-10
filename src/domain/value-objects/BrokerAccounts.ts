import {BrokerName} from './BrokerName.js';

export class BrokerAccounts {
    private constructor(
        private readonly securitiesAccount: string,
        private readonly cashAccount: string,
    ) {
    }

    static fromBrokerName(brokerName: BrokerName): BrokerAccounts {
        const name = brokerName.toString();

        return new BrokerAccounts(name, name);
    }

    getSecuritiesAccount(): string {
        return this.securitiesAccount;
    }

    getCashAccount(): string {
        return this.cashAccount;
    }
}
