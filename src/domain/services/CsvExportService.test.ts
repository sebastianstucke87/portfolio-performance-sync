import {describe, expect, it} from 'vitest';
import {TransactionFactory} from '../../infrastructure/scalable-capital/factories/TransactionFactory.js';
import {CsvExportService} from './CsvExportService.js';
import {BrokerAccounts} from '../value-objects/BrokerAccounts.js';
import {BrokerName} from '../value-objects/BrokerName.js';
import {TransactionResponseDto} from '../../infrastructure/scalable-capital/dto/TransactionResponseDto.js';

const TEST_ACCOUNTS = BrokerAccounts.fromBrokerName(BrokerName.fromString('Acme Broker'));

describe('CsvExportService', () => {
    it('should transform API DTOs to Portfolio Performance CSV format', () => {
        const factory = new TransactionFactory();
        const csvExportService = new CsvExportService();

        const dtos: TransactionResponseDto[] = [
            {
                id: 'tx-001',
                currency: 'EUR',
                type: 'SECURITY_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-11-15T10:30:00Z',
                description: 'Acme World ETF',
                securityTransactionType: 'BUY',
                quantity: 1.234567,
                amount: -150.50,
                side: 'BUY',
                isin: 'XX0000000001',
            },
            {
                id: 'tx-002',
                currency: 'EUR',
                type: 'SECURITY_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-11-20T14:00:00Z',
                description: 'Acme Emerging Markets ETF',
                securityTransactionType: 'SAVINGS_PLAN',
                quantity: 0.5,
                amount: -50.0,
                side: 'BUY',
                isin: 'XX0000000002',
            },
            {
                id: 'tx-003',
                currency: 'EUR',
                type: 'SECURITY_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-01T09:15:00Z',
                description: 'Acme World ETF',
                securityTransactionType: 'SELL',
                quantity: 0.5,
                amount: 75.25,
                side: 'SELL',
                isin: 'XX0000000001',
            },
            {
                id: 'tx-004',
                currency: 'EUR',
                type: 'CASH_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-05T08:00:00Z',
                description: 'Dividend Payment',
                cashTransactionType: 'DIVIDEND',
                amount: 12.34,
                relatedIsin: 'XX0000000001',
            },
            {
                id: 'tx-005',
                currency: 'EUR',
                type: 'CASH_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-05T08:01:00Z',
                description: 'Tax Withholding',
                cashTransactionType: 'TAX',
                amount: -3.21,
            },
            {
                id: 'tx-006',
                currency: 'EUR',
                type: 'CASH_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-10T12:00:00Z',
                description: 'Cash Deposit',
                cashTransactionType: 'DEPOSIT',
                amount: 500.0,
            },
            {
                id: 'tx-007',
                currency: 'EUR',
                type: 'CASH_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-12T16:30:00Z',
                description: 'Cash Withdrawal',
                cashTransactionType: 'WITHDRAWAL',
                amount: -100.0,
            },
            {
                id: 'tx-008',
                currency: 'EUR',
                type: 'NON_TRADE_SECURITY_TRANSACTION',
                status: 'SETTLED',
                isCancellation: false,
                lastEventDateTime: '1999-12-15T11:00:00Z',
                description: 'Securities Transfer In',
                nonTradeSecurityTransactionType: 'TRANSFER_IN',
                quantity: 10.0,
                amount: 0,
                isin: 'XX0000000003',
            },
        ];

        const transactions = dtos.map((dto) => factory.createFromDto(dto));
        const csv = csvExportService.toCsv(transactions, TEST_ACCOUNTS);

        const lines = csv.split('\n');

        expect(lines[0]).toBe(
            'Date,Type,Value,Shares,ISIN,WKN,Security Name,Fees,Taxes,Note,Securities Account,Cash Account',
        );

        // Buy transaction
        expect(lines[1]).toBe(
            '1999-11-15,Buy,150.50,1.234567,XX0000000001,,Acme World ETF,,,' +
            ',Acme Broker,Acme Broker',
        );

        // Savings plan (mapped to Buy with note)
        expect(lines[2]).toBe(
            '1999-11-20,Buy,50.00,0.500000,XX0000000002,,Acme Emerging Markets ETF,,,' +
            'Savings plan execution,Acme Broker,Acme Broker',
        );

        // Sell transaction
        expect(lines[3]).toBe(
            '1999-12-01,Sell,75.25,0.500000,XX0000000001,,Acme World ETF,,,' +
            ',Acme Broker,Acme Broker',
        );

        // Dividend (is a security transaction - relates to a security)
        expect(lines[4]).toBe(
            '1999-12-05,Dividend,12.34,,XX0000000001,,Dividend Payment,,,,Acme Broker,Acme Broker',
        );

        // Tax (not a security transaction)
        expect(lines[5]).toBe('1999-12-05,Taxes,3.21,,,,Tax Withholding,,,,,Acme Broker');

        // Deposit (not a security transaction)
        expect(lines[6]).toBe('1999-12-10,Deposit,500.00,,,,Cash Deposit,,,,,Acme Broker');

        // Withdrawal (Removal, not a security transaction)
        expect(lines[7]).toBe('1999-12-12,Removal,100.00,,,,Cash Withdrawal,,,,,Acme Broker');

        // Transfer In
        expect(lines[8]).toBe(
            '1999-12-15,Transfer (Inbound),0.00,10.000000,XX0000000003,,Securities Transfer In,,,' +
            ',Acme Broker,Acme Broker',
        );

        expect(lines.length).toBe(9);
    });

    it('should handle security names with special characters', () => {
        const factory = new TransactionFactory();
        const csvExportService = new CsvExportService();

        const dto: TransactionResponseDto = {
            id: 'tx-special',
            currency: 'EUR',
            type: 'SECURITY_TRANSACTION',
            status: 'SETTLED',
            isCancellation: false,
            lastEventDateTime: '1999-12-31T10:00:00Z',
            description: 'Some ETF, with "special" characters\nand newline',
            securityTransactionType: 'BUY',
            quantity: 1.0,
            amount: -100.0,
            side: 'BUY',
            isin: 'XX0000000099',
        };

        const transactions = [factory.createFromDto(dto)];
        const csv = csvExportService.toCsv(transactions, TEST_ACCOUNTS);

        const lines = csv.split('\n');
        expect(lines[1]).toContain('"Some ETF, with ""special"" characters');
    });

    it('should handle INTEREST transaction type', () => {
        const factory = new TransactionFactory();
        const csvExportService = new CsvExportService();

        const dto: TransactionResponseDto = {
            id: 'tx-interest',
            currency: 'EUR',
            type: 'CASH_TRANSACTION',
            status: 'SETTLED',
            isCancellation: false,
            lastEventDateTime: '1999-12-31T12:00:00Z',
            description: 'Interest Payment',
            cashTransactionType: 'INTEREST',
            amount: 5.67,
        };

        const transactions = [factory.createFromDto(dto)];
        const csv = csvExportService.toCsv(transactions, TEST_ACCOUNTS);

        const lines = csv.split('\n');
        expect(lines[1]).toBe('1999-12-31,Interest,5.67,,,,Interest Payment,,,,,Acme Broker');
    });

    it('should handle FEE transaction type', () => {
        const factory = new TransactionFactory();
        const csvExportService = new CsvExportService();

        const dto: TransactionResponseDto = {
            id: 'tx-fee',
            currency: 'EUR',
            type: 'CASH_TRANSACTION',
            status: 'SETTLED',
            isCancellation: false,
            lastEventDateTime: '1999-12-31T14:00:00Z',
            description: 'Account Fee',
            cashTransactionType: 'FEE',
            amount: -2.50,
        };

        const transactions = [factory.createFromDto(dto)];
        const csv = csvExportService.toCsv(transactions, TEST_ACCOUNTS);

        const lines = csv.split('\n');
        expect(lines[1]).toBe('1999-12-31,Fees,2.50,,,,Account Fee,,,,,Acme Broker');
    });

    it('should handle Transfer (Outbound) transaction type', () => {
        const factory = new TransactionFactory();
        const csvExportService = new CsvExportService();

        const dto: TransactionResponseDto = {
            id: 'tx-transfer-out',
            currency: 'EUR',
            type: 'NON_TRADE_SECURITY_TRANSACTION',
            status: 'SETTLED',
            isCancellation: false,
            lastEventDateTime: '1999-12-31T16:00:00Z',
            description: 'Securities Transfer Out',
            nonTradeSecurityTransactionType: 'TRANSFER_OUT',
            quantity: 5.0,
            amount: 0,
            isin: 'XX0000000001',
        };

        const transactions = [factory.createFromDto(dto)];
        const csv = csvExportService.toCsv(transactions, TEST_ACCOUNTS);

        const lines = csv.split('\n');
        expect(lines[1]).toBe(
            '1999-12-31,Transfer (Outbound),0.00,5.000000,XX0000000001,,Securities Transfer Out,,,' +
            ',Acme Broker,Acme Broker',
        );
    });
});
