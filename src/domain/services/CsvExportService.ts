import {Transaction} from '../entities/Transaction.js';
import {BrokerAccounts} from '../value-objects/BrokerAccounts.js';

const CSV_HEADERS = [
    'Date',
    'Type',
    'Value',
    'Shares',
    'ISIN',
    'WKN',
    'Security Name',
    'Fees',
    'Taxes',
    'Note',
    'Securities Account',
    'Cash Account',
];

export class CsvExportService {
    toCsv(transactions: Transaction[], accounts: BrokerAccounts): string {
        const lines: string[] = [CSV_HEADERS.join(',')];

        for (const tx of transactions) {
            const row = this.transactionToCsvRow(tx, accounts);
            lines.push(row.join(','));
        }

        return lines.join('\n');
    }

    private transactionToCsvRow(tx: Transaction, accounts: BrokerAccounts): string[] {
        return [
            tx.date.formatForCsv(),
            tx.type.toString(),
            tx.amount.formatForCsv(),
            this.formatShares(tx.shares),
            tx.isin?.toString() ?? '',
            tx.wkn ?? '',
            this.escapeForCsv(tx.description),
            '', // Fees - empty, included in amount
            '', // Taxes - empty, included in amount
            this.escapeForCsv(tx.note ?? ''),
            tx.type.isSecurityTransaction() ? accounts.getSecuritiesAccount() : '',
            accounts.getCashAccount(),
        ];
    }

    private formatShares(shares: number | null): string {
        if (shares === null) {
            return '';
        }

        return shares.toFixed(6);
    }

    private escapeForCsv(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }

        return value;
    }
}
