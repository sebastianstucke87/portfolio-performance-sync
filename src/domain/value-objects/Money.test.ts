import {describe, expect, it} from 'vitest';
import {Money} from './Money.js';

describe('Money', () => {
    describe('create', () => {
        it('throws for empty currency', () => {
            expect(() => Money.create(100, '')).toThrow('Invalid currency code');
        });

        it('throws for currency with wrong length', () => {
            expect(() => Money.create(100, 'EU')).toThrow('Invalid currency code');
            expect(() => Money.create(100, 'EURO')).toThrow('Invalid currency code');
        });

        it('creates Money with valid currency', () => {
            const money = Money.create(100.50, 'EUR');
            expect(money.getAmount()).toBe(100.50);
            expect(money.getCurrency()).toBe('EUR');
        });

        it('normalizes currency to uppercase', () => {
            const money = Money.create(100, 'eur');
            expect(money.getCurrency()).toBe('EUR');
        });

        it('allows negative amounts', () => {
            const money = Money.create(-100.50, 'EUR');
            expect(money.getAmount()).toBe(-100.50);
            expect(money.isNegative()).toBe(true);
        });

        it('allows zero amounts', () => {
            const money = Money.create(0, 'EUR');
            expect(money.getAmount()).toBe(0);
            expect(money.isNegative()).toBe(false);
        });
    });

    describe('formatForCsv', () => {
        it('formats with period decimal separator', () => {
            const money = Money.create(1234.56, 'EUR');
            expect(money.formatForCsv()).toBe('1234.56');
        });

        it('formats negative amounts', () => {
            const money = Money.create(-1234.56, 'EUR');
            expect(money.formatForCsv()).toBe('-1234.56');
        });

        it('pads to 2 decimal places', () => {
            const money = Money.create(100, 'EUR');
            expect(money.formatForCsv()).toBe('100.00');
        });
    });

    describe('abs', () => {
        it('returns absolute value', () => {
            const money = Money.create(-100.50, 'EUR');
            const abs = money.abs();
            expect(abs.getAmount()).toBe(100.50);
            expect(abs.getCurrency()).toBe('EUR');
        });
    });

    describe('equals', () => {
        it('returns true for equal Money', () => {
            const money1 = Money.create(100.50, 'EUR');
            const money2 = Money.create(100.50, 'EUR');
            expect(money1.equals(money2)).toBe(true);
        });

        it('returns false for different amounts', () => {
            const money1 = Money.create(100.50, 'EUR');
            const money2 = Money.create(100.51, 'EUR');
            expect(money1.equals(money2)).toBe(false);
        });

        it('returns false for different currencies', () => {
            const money1 = Money.create(100.50, 'EUR');
            const money2 = Money.create(100.50, 'USD');
            expect(money1.equals(money2)).toBe(false);
        });
    });
});
