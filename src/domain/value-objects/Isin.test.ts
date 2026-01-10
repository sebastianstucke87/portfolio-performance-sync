import {describe, expect, it} from 'vitest';
import {Isin} from './Isin.js';

describe('Isin', () => {
    describe('create', () => {
        it('throws for empty string', () => {
            expect(() => Isin.create('')).toThrow('Invalid ISIN');
        });

        it('throws for too short ISIN', () => {
            expect(() => Isin.create('XX00000000')).toThrow('Invalid ISIN');
        });

        it('throws for too long ISIN', () => {
            expect(() => Isin.create('XX00000000111')).toThrow('Invalid ISIN');
        });

        it('throws for invalid country code', () => {
            expect(() => Isin.create('120000000011')).toThrow('Invalid ISIN');
        });

        it('creates valid ISIN and normalizes to uppercase', () => {
            const isin = Isin.create('xx0000000011');
            expect(isin.toString()).toBe('XX0000000011');
        });

        it('creates valid ISIN with trimmed whitespace', () => {
            const isin = Isin.create('  XX0000000011  ');
            expect(isin.toString()).toBe('XX0000000011');
        });

        it('creates ISIN for various valid formats', () => {
            expect(Isin.create('YY0000000026').toString()).toBe('YY0000000026');
            expect(Isin.create('ZZ0000000030').toString()).toBe('ZZ0000000030');
            expect(Isin.create('AA0000000043').toString()).toBe('AA0000000043');
        });
    });

    describe('equals', () => {
        it('returns true for equal ISINs', () => {
            const isin1 = Isin.create('XX0000000011');
            const isin2 = Isin.create('XX0000000011');
            expect(isin1.equals(isin2)).toBe(true);
        });

        it('returns false for different ISINs', () => {
            const isin1 = Isin.create('XX0000000011');
            const isin2 = Isin.create('YY0000000026');
            expect(isin1.equals(isin2)).toBe(false);
        });
    });
});
