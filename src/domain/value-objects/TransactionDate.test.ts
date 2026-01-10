import {describe, expect, it} from 'vitest';
import {TransactionDate} from './TransactionDate.js';

describe('TransactionDate', () => {
    describe('create', () => {
        it('throws for invalid date string', () => {
            expect(() => TransactionDate.create('not-a-date')).toThrow('Invalid date');
        });

        it('throws for empty string', () => {
            expect(() => TransactionDate.create('')).toThrow('Invalid date');
        });

        it('creates from ISO string', () => {
            const date = TransactionDate.create('1999-12-31T12:00:00.000Z');
            expect(date.formatForCsv()).toBe('1999-12-31');
        });

        it('creates from date-only string', () => {
            const date = TransactionDate.create('1999-06-15');
            expect(date.formatForCsv()).toBe('1999-06-15');
        });
    });

    describe('formatForCsv', () => {
        it('formats as YYYY-MM-DD', () => {
            const date = TransactionDate.create('1999-03-05T12:00:00Z');
            expect(date.formatForCsv()).toBe('1999-03-05');
        });

        it('pads month and day with zeros', () => {
            const date = TransactionDate.create('1999-01-09T00:00:00Z');
            expect(date.formatForCsv()).toBe('1999-01-09');
        });
    });

    describe('equals', () => {
        it('returns true for same timestamp', () => {
            const date1 = TransactionDate.create('1999-12-31T10:30:00.000Z');
            const date2 = TransactionDate.create('1999-12-31T10:30:00.000Z');
            expect(date1.equals(date2)).toBe(true);
        });

        it('returns false for different timestamps', () => {
            const date1 = TransactionDate.create('1999-12-31T10:30:00.000Z');
            const date2 = TransactionDate.create('1999-12-31T10:30:00.001Z');
            expect(date1.equals(date2)).toBe(false);
        });
    });
});
