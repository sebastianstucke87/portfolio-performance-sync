import {PortfolioId} from '../value-objects/PortfolioId.js';
import {PortfolioName} from '../value-objects/PortfolioName.js';

export class Portfolio {
    constructor(
        private readonly id: PortfolioId,
        private readonly name: PortfolioName,
    ) {
    }

    getId(): PortfolioId {
        return this.id;
    }

    getName(): PortfolioName {
        return this.name;
    }
}
