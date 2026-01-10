import {PortfolioDto} from '../dto/PortfolioDto.js';

export class ContentScriptClient {
    async fetchPortfolios(tabId: number): Promise<PortfolioDto[]> {
        const response = (await chrome.tabs.sendMessage(tabId, {
            action: 'getPortfolios',
        })) as { portfolios?: PortfolioDto[]; error?: string } | undefined;

        if (!response) {
            throw new Error('Empty response from content script');
        }

        if (response.error) {
            throw new Error(response.error);
        }

        if (!Array.isArray(response.portfolios)) {
            throw new Error('Invalid portfolio response from content script');
        }

        return response.portfolios;
    }

    async export(tabId: number, portfolios: PortfolioDto[]): Promise<void> {
        const response = (await chrome.tabs.sendMessage(tabId, {
            action: 'export',
            portfolios,
        })) as { error?: string } | undefined;

        if (!response) {
            throw new Error('Empty response from content script');
        }

        if (response.error) {
            throw new Error(response.error);
        }
    }
}
