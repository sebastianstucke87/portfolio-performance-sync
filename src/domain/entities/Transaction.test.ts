import {describe, expect, it} from 'vitest';
import {Transaction} from './Transaction.js';
import {Isin} from '../value-objects/Isin.js';
import {Money} from '../value-objects/Money.js';
import {TransactionDate} from '../value-objects/TransactionDate.js';
import {TransactionType} from '../value-objects/TransactionType.js';

describe('Transaction', () => {
    describe('create', () => {
        it('throws for empty ID', () => {
            expect(() =>
                Transaction.create({
                    id: '',
                    date: TransactionDate.create('1999-12-31'),
                    type: TransactionType.Buy,
                    amount: Money.create(100, 'EUR'),
                    isin: null,
                    wkn: null,
                    shares: null,
                    description: 'Test',
                    note: null,
                }),
            ).toThrow('Transaction ID is required');
        });

        it('creates valid transaction with all fields', () => {
            const tx = Transaction.create({
                id: 'tx-123',
                date: TransactionDate.create('1999-12-31'),
                type: TransactionType.Buy,
                amount: Money.create(1000, 'EUR'),
                isin: Isin.create('XX0000000001'),
                wkn: 'ABC123',
                shares: 10.5,
                description: 'Acme World ETF',
                note: 'Savings plan',
            });

            expect(tx.id).toBe('tx-123');
            expect(tx.type.toString()).toBe('Buy');
            expect(tx.amount.getAmount()).toBe(1000);
            expect(tx.isin?.toString()).toBe('XX0000000001');
            expect(tx.wkn).toBe('ABC123');
            expect(tx.shares).toBe(10.5);
            expect(tx.description).toBe('Acme World ETF');
            expect(tx.note).toBe('Savings plan');
        });

        it('creates valid transaction with minimal fields', () => {
            const tx = Transaction.create({
                id: 'tx-456',
                date: TransactionDate.create('1999-12-31'),
                type: TransactionType.Deposit,
                amount: Money.create(500, 'EUR'),
                isin: null,
                wkn: null,
                shares: null,
                description: 'Deposit',
                note: null,
            });

            expect(tx.id).toBe('tx-456');
            expect(tx.isin).toBeNull();
            expect(tx.shares).toBeNull();
        });
    });
});
