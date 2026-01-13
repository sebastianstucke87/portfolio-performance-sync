import {BrokerServiceFactory} from '../../application/factories/BrokerServiceFactory.js';
import {ContentScriptClient} from '../clients/ContentScriptClient.js';
import {TabPortfolioStore} from '../stores/TabPortfolioStore.js';

const ICON = {
    16: 'icons/icon-16.png',
    32: 'icons/icon-32.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
};

export class BackgroundController {
    constructor(
        private readonly brokerServiceFactory: BrokerServiceFactory,
        private readonly contentScriptClient: ContentScriptClient,
        private readonly tabPortfolioStore: TabPortfolioStore,
    ) {
    }

    register(): void {
        chrome.action.onClicked.addListener((tab) => {
            if (tab?.id) {
                this.triggerExport(tab.id).catch((error) => {
                    throw error;
                });
            }
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status !== 'complete') return;

            this.handleTabUpdated(tabId, tab.url).catch((error) => {
                throw error;
            });
        });

        chrome.tabs.onRemoved.addListener((tabId) => {
            this.tabPortfolioStore.delete(tabId);
        });
    }

    private async handleTabUpdated(tabId: number, url: string | undefined): Promise<void> {
        const isSupported = url ? this.brokerServiceFactory.supportsUrl(url) : false;
        if (!isSupported) {
            this.tabPortfolioStore.delete(tabId);
            this.setDefaultUi(tabId);
            return;
        }

        this.setCheckingUi(tabId);
        await this.refreshPortfolios(tabId);
        this.updateUiForPortfolios(tabId);
    }

    private async refreshPortfolios(tabId: number): Promise<void> {
        const portfolios = await this.contentScriptClient.fetchPortfolios(tabId);
        this.tabPortfolioStore.set(tabId, portfolios);
    }

    private updateUiForPortfolios(tabId: number): void {
        const portfolios = this.tabPortfolioStore.get(tabId);
        if (portfolios.length === 0) {
            this.setWaitingUi(tabId, 'Please log in to export');
            return;
        }

        const names = portfolios.map((portfolio) => portfolio.name).join(', ');
        chrome.action.setBadgeText({tabId, text: 'CSV'});
        chrome.action.setBadgeBackgroundColor({tabId, color: '#4CAF50'});
        chrome.action.setTitle({tabId, title: `Export: ${names}`});
    }

    private async triggerExport(tabId: number): Promise<void> {
        const portfolios = await this.contentScriptClient.fetchPortfolios(tabId);
        if (portfolios.length === 0) {
            return;
        }
        await this.contentScriptClient.export(tabId, portfolios);
    }

    private setDefaultUi(tabId: number): void {
        chrome.action.setIcon({tabId, path: ICON});
        chrome.action.setBadgeText({tabId, text: ''});
        chrome.action.setTitle({tabId, title: 'Portfolio Performance Sync'});
    }

    private setCheckingUi(tabId: number): void {
        this.setWaitingUi(tabId, 'Checking portfolios...');
    }

    private setWaitingUi(tabId: number, title: string): void {
        chrome.action.setIcon({tabId, path: ICON});
        chrome.action.setBadgeText({tabId, text: ''});
        chrome.action.setTitle({tabId, title});
    }
}
