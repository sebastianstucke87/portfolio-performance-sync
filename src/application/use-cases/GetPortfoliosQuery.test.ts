import {describe, expect, it} from 'vitest';
import {GetPortfoliosQuery} from './GetPortfoliosQuery.js';
import {BrokerName} from '../../domain/value-objects/BrokerName.js';
import {Portfolio} from '../../domain/entities/Portfolio.js';
import {PortfolioId} from '../../domain/value-objects/PortfolioId.js';
import {PortfolioName} from '../../domain/value-objects/PortfolioName.js';
import {BrokerService} from '../../domain/ports/BrokerService.js';
import {BrokerServiceFactory} from '../factories/BrokerServiceFactory.js';

const brokerName = BrokerName.fromString('Acme Broker');
const portfolio = new Portfolio(
    PortfolioId.fromString('portfolio-1'),
    PortfolioName.fromString('Main'),
);

const brokerService: BrokerService = {
    supportsUrl: (url) => url.includes('acme.test'),
    getName: () => brokerName,
    getPortfolios: async () => [portfolio],
    getTransactions: async () => [],
};

describe('GetPortfoliosQuery', () => {
    it('returns portfolios from broker service', async () => {
        const brokerServiceFactory = new BrokerServiceFactory([brokerService]);
        const query = new GetPortfoliosQuery(brokerServiceFactory);

        const result = await query.execute('https://acme.test');

        expect(result).toEqual([portfolio]);
    });
});
