import {describe, expect, it} from 'vitest';
import {BrokerName} from './BrokerName.js';

describe('BrokerName', () => {
    it('throws when empty', () => {
        expect(() => BrokerName.fromString('')).toThrow('Broker name must not be empty');
    });

    it('throws when only whitespace', () => {
        expect(() => BrokerName.fromString('   ')).toThrow('Broker name must not be empty');
    });
});
