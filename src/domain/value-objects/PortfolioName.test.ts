import {describe, expect, it} from 'vitest';
import {PortfolioName} from './PortfolioName.js';

describe('PortfolioName', () => {
    it('throws when empty', () => {
        expect(() => PortfolioName.fromString('')).toThrow('Portfolio name must not be empty');
    });

    it('throws when only whitespace', () => {
        expect(() => PortfolioName.fromString('   ')).toThrow('Portfolio name must not be empty');
    });
});
