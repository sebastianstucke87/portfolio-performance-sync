import {describe, expect, it} from 'vitest';
import {TransactionFactory} from './TransactionFactory.js';
import {TransactionResponseDto} from '../dto/TransactionResponseDto.js';

describe('TransactionFactory', () => {
    const factory = new TransactionFactory();

    const baseDto: Partial<TransactionResponseDto> = {
        id: 'tx-test',
        currency: 'EUR',
        status: 'SETTLED',
        isCancellation: false,
        lastEventDateTime: '1999-12-31T12:00:00Z',
        description: 'Test Transaction',
        amount: 100.0,
    };

    describe('SECURITY_TRANSACTION', () => {
        it('maps BUY side to Buy type', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'SECURITY_TRANSACTION',
                securityTransactionType: 'BUY',
                side: 'BUY',
                quantity: 1.0,
                amount: -100.0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Buy');
            expect(tx.shares).toBe(1.0);
            expect(tx.isin?.toString()).toBe('XX0000000001');
        });

        it('maps SELL side to Sell type', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'SECURITY_TRANSACTION',
                securityTransactionType: 'SELL',
                side: 'SELL',
                quantity: 2.0,
                amount: 200.0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Sell');
            expect(tx.shares).toBe(2.0);
        });

        it('maps SAVINGS_PLAN to Buy type with note', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'SECURITY_TRANSACTION',
                securityTransactionType: 'SAVINGS_PLAN',
                side: 'BUY',
                quantity: 0.5,
                amount: -50.0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Buy');
            expect(tx.note).toBe('Savings plan execution');
        });
    });

    describe('NON_TRADE_SECURITY_TRANSACTION', () => {
        it('maps TRANSFER_IN to Transfer (Inbound)', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'NON_TRADE_SECURITY_TRANSACTION',
                nonTradeSecurityTransactionType: 'TRANSFER_IN',
                quantity: 10.0,
                amount: 0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Transfer (Inbound)');
            expect(tx.shares).toBe(10.0);
        });

        it('maps TRANSFER_OUT to Transfer (Outbound)', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'NON_TRADE_SECURITY_TRANSACTION',
                nonTradeSecurityTransactionType: 'TRANSFER_OUT',
                quantity: 5.0,
                amount: 0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Transfer (Outbound)');
        });

        it('throws for unknown non-trade transaction type', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'NON_TRADE_SECURITY_TRANSACTION',
                nonTradeSecurityTransactionType: 'UNKNOWN_TYPE',
                quantity: 1.0,
                amount: 0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            expect(() => factory.createFromDto(dto)).toThrow();
        });
    });

    describe('CASH_TRANSACTION', () => {
        it('maps DIVIDEND to Dividend', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'DIVIDEND',
                amount: 12.34,
                relatedIsin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Dividend');
            expect(tx.isin?.toString()).toBe('XX0000000001');
        });

        it('maps INTEREST to Interest', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'INTEREST',
                amount: 5.67,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Interest');
        });

        it('maps TAX to Taxes', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'TAX',
                amount: -3.21,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Taxes');
            expect(tx.amount.getAmount()).toBe(3.21);
        });

        it('maps FEE to Fees', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'FEE',
                amount: -2.50,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Fees');
            expect(tx.amount.getAmount()).toBe(2.50);
        });

        it('maps DEPOSIT to Deposit', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'DEPOSIT',
                amount: 500.0,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Deposit');
        });

        it('maps WITHDRAWAL to Removal', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'WITHDRAWAL',
                amount: -100.0,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.type.toString()).toBe('Removal');
            expect(tx.amount.getAmount()).toBe(100.0);
        });

        it('throws for unknown cash transaction type', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'UNKNOWN_TYPE',
                amount: 100.0,
            } as TransactionResponseDto;

            expect(() => factory.createFromDto(dto)).toThrow();
        });
    });

    describe('unknown transaction type', () => {
        it('throws for completely unknown type', () => {
            const dto = {
                ...baseDto,
                type: 'UNKNOWN_TYPE',
                amount: 100.0,
            } as unknown as TransactionResponseDto;

            expect(() => factory.createFromDto(dto)).toThrow();
        });
    });

    describe('ISIN extraction', () => {
        it('extracts ISIN from isin field', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'SECURITY_TRANSACTION',
                securityTransactionType: 'BUY',
                side: 'BUY',
                quantity: 1.0,
                amount: -100.0,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.isin?.toString()).toBe('XX0000000001');
        });

        it('extracts ISIN from relatedIsin field', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'DIVIDEND',
                amount: 12.34,
                relatedIsin: 'XX0000000002',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.isin?.toString()).toBe('XX0000000002');
        });

        it('returns null when no ISIN present', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'CASH_TRANSACTION',
                cashTransactionType: 'TAX',
                amount: -3.21,
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.isin).toBeNull();
        });
    });

    describe('amount handling', () => {
        it('uses absolute value for amount', () => {
            const dto: TransactionResponseDto = {
                ...baseDto,
                type: 'SECURITY_TRANSACTION',
                securityTransactionType: 'BUY',
                side: 'BUY',
                quantity: 1.0,
                amount: -150.50,
                isin: 'XX0000000001',
            } as TransactionResponseDto;

            const tx = factory.createFromDto(dto);

            expect(tx.amount.getAmount()).toBe(150.50);
        });
    });
});
