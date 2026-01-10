import {PortfolioDto} from '../dto/PortfolioDto.js';

export class TabPortfolioStore {
    private readonly tabPortfolios = new Map<number, PortfolioDto[]>();

    get(tabId: number): PortfolioDto[] {
        return this.tabPortfolios.get(tabId) ?? [];
    }

    set(tabId: number, portfolios: PortfolioDto[]): void {
        this.tabPortfolios.set(tabId, portfolios);
    }

    delete(tabId: number): void {
        this.tabPortfolios.delete(tabId);
    }
}
