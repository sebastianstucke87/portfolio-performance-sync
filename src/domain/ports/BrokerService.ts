import {Portfolio} from '../entities/Portfolio.js';
import {Transaction} from '../entities/Transaction.js';
import {BrokerName} from '../value-objects/BrokerName.js';

export interface BrokerService {
    supportsUrl(url: string): boolean;

    getName(): BrokerName;

    getPortfolios(): Promise<Portfolio[]>;

    getTransactions(portfolio: Portfolio): Promise<Transaction[]>;
}
