import {describe, expect, it} from 'vitest';
import {ExportTransactionsCommand} from './ExportTransactionsCommand.js';
import {BrokerName} from '../../domain/value-objects/BrokerName.js';
import {Portfolio} from '../../domain/entities/Portfolio.js';
import {PortfolioId} from '../../domain/value-objects/PortfolioId.js';
import {PortfolioName} from '../../domain/value-objects/PortfolioName.js';
import {BrokerService} from '../../domain/ports/BrokerService.js';
import {BrokerServiceFactory} from '../factories/BrokerServiceFactory.js';
import {CsvExportService} from '../../domain/services/CsvExportService.js';
import {ExportFilenameService} from '../../domain/services/ExportFilenameService.js';
import {FileDownloader} from '../../domain/ports/FileDownloader.js';
import {Transaction} from '../../domain/entities/Transaction.js';
import {TransactionDate} from '../../domain/value-objects/TransactionDate.js';
import {TransactionType} from '../../domain/value-objects/TransactionType.js';
import {Money} from '../../domain/value-objects/Money.js';

const brokerName = BrokerName.fromString('Acme Broker');
const portfolio = new Portfolio(
    PortfolioId.fromString('portfolio-1'),
    PortfolioName.fromString('Main'),
);

const transaction = Transaction.create({
    id: 'tx-1',
    date: TransactionDate.create('2025-12-31T10:00:00Z'),
    type: TransactionType.Buy,
    amount: Money.create(100, 'EUR'),
    isin: null,
    wkn: null,
    shares: 1,
    description: 'Test',
    note: null,
});

const brokerService: BrokerService = {
    supportsUrl: (url) => url.includes('acme.test'),
    getName: () => brokerName,
    getPortfolios: async () => [],
    getTransactions: async () => [transaction],
};

const csvExportService = new CsvExportService();
const exportFilenameService = new ExportFilenameService();
const brokerServiceFactory = new BrokerServiceFactory([brokerService]);

const downloads: Array<{ filename: string; content: string; mimeType: string }> = [];
const fileDownloader: FileDownloader = {
    download: (filename, content, mimeType) => {
        downloads.push({filename, content, mimeType});
    },
};

describe('ExportTransactionsCommand', () => {
    it('exports a csv file for each portfolio', async () => {
        const command = new ExportTransactionsCommand(
            brokerServiceFactory,
            csvExportService,
            exportFilenameService,
            fileDownloader,
        );

        const now = new Date('2026-01-01T01:02:03Z');
        await command.execute('https://acme.test', [portfolio], now);

        expect(downloads.length).toBe(1);
        expect(downloads[0].filename).toBe('Acme Broker-Main-2026-01-0101-02-03.csv');
        expect(downloads[0].content).toContain('Date,Type,Value');
        expect(downloads[0].mimeType).toBe('text/csv;charset=utf-8');
    });
});
