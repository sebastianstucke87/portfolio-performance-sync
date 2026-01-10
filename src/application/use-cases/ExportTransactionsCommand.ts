import {Portfolio} from '../../domain/entities/Portfolio.js';
import {CsvExportService} from '../../domain/services/CsvExportService.js';
import {FileDownloader} from '../../domain/ports/FileDownloader.js';
import {ExportFilenameService} from '../../domain/services/ExportFilenameService.js';
import {BrokerAccounts} from '../../domain/value-objects/BrokerAccounts.js';
import {BrokerServiceFactory} from '../factories/BrokerServiceFactory.js';

export class ExportTransactionsCommand {
    constructor(
        private readonly brokerServiceFactory: BrokerServiceFactory,
        private readonly csvExportService: CsvExportService,
        private readonly exportFilenameService: ExportFilenameService,
        private readonly fileDownloader: FileDownloader,
    ) {
    }

    async execute(url: string, portfolios: Portfolio[], now = new Date()): Promise<void> {
        const broker = this.brokerServiceFactory.createForUrl(url);
        const brokerName = broker.getName();
        const accounts = BrokerAccounts.fromBrokerName(brokerName);

        for (const portfolio of portfolios) {
            const transactions = await broker.getTransactions(portfolio);
            const csv = this.csvExportService.toCsv(transactions, accounts);
            const filename = this.exportFilenameService.createFilename(
                brokerName,
                portfolio.getName(),
                now,
            );

            this.fileDownloader.download(filename, csv, 'text/csv;charset=utf-8');
        }
    }
}
