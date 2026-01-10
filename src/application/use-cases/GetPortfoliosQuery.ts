import {Portfolio} from '../../domain/entities/Portfolio.js';
import {BrokerServiceFactory} from '../factories/BrokerServiceFactory.js';

export class GetPortfoliosQuery {
    constructor(
        private readonly brokerServiceFactory: BrokerServiceFactory,
    ) {
    }

    async execute(url: string): Promise<Portfolio[]> {
        return this.brokerServiceFactory.createForUrl(url).getPortfolios();
    }
}
