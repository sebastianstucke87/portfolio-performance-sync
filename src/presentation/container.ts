import {CsvExportService} from '../domain/services/CsvExportService.js';
import {ExportFilenameService} from '../domain/services/ExportFilenameService.js';
import {ExportTransactionsCommand} from '../application/use-cases/ExportTransactionsCommand.js';
import {GetPortfoliosQuery} from '../application/use-cases/GetPortfoliosQuery.js';
import {BrokerServiceFactory} from '../application/factories/BrokerServiceFactory.js';
import {BrowserFileDownloader} from '../infrastructure/browser/BrowserFileDownloader.js';
import {SessionExtractor} from '../infrastructure/browser/SessionExtractor.js';
import {GraphQLClient} from '../infrastructure/scalable-capital/GraphQLClient.js';
import {ScalableCapitalBrokerService} from '../infrastructure/scalable-capital/ScalableCapitalBrokerService.js';
import {TransactionFactory} from '../infrastructure/scalable-capital/factories/TransactionFactory.js';
import {BackgroundController} from './controllers/BackgroundController.js';
import {ContentScriptController} from './controllers/ContentScriptController.js';
import {ContentScriptClient} from './clients/ContentScriptClient.js';
import {TabPortfolioStore} from './stores/TabPortfolioStore.js';

export class Container {
    constructor(private readonly baseUrl: string = '') {
    }

    createContentScriptController(): ContentScriptController {
        return new ContentScriptController(
            this.createGetPortfoliosQuery(),
            this.createExportTransactionsCommand(),
        );
    }

    createBackgroundController(): BackgroundController {
        const contentScriptClient = new ContentScriptClient();
        const store = new TabPortfolioStore();

        return new BackgroundController(
            this.createBrokerServiceFactory(),
            contentScriptClient,
            store,
        );
    }

    private createGetPortfoliosQuery(): GetPortfoliosQuery {
        return new GetPortfoliosQuery(this.createBrokerServiceFactory());
    }

    private createExportTransactionsCommand(): ExportTransactionsCommand {
        return new ExportTransactionsCommand(
            this.createBrokerServiceFactory(),
            new CsvExportService(),
            new ExportFilenameService(),
            new BrowserFileDownloader(),
        );
    }

    private createBrokerServiceFactory(): BrokerServiceFactory {
        const scalableService = new ScalableCapitalBrokerService(
            new GraphQLClient(this.baseUrl),
            new TransactionFactory(),
            new SessionExtractor(),
        );

        return new BrokerServiceFactory([scalableService]);
    }
}
