import {describe, expect, it} from 'vitest';
import {PortfolioId} from './PortfolioId.js';

describe('PortfolioId', () => {
    it('throws when empty', () => {
        expect(() => PortfolioId.fromString('')).toThrow('Portfolio ID must not be empty');
    });

    it('throws when only whitespace', () => {
        expect(() => PortfolioId.fromString('   ')).toThrow('Portfolio ID must not be empty');
    });
});
