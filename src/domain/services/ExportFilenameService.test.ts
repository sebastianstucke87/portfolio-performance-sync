import {describe, expect, it} from 'vitest';
import {ExportFilenameService} from './ExportFilenameService.js';
import {BrokerName} from '../value-objects/BrokerName.js';
import {PortfolioName} from '../value-objects/PortfolioName.js';

describe('ExportFilenameService', () => {
    it('throws for invalid broker name segment', () => {
        const service = new ExportFilenameService();
        const brokerName = BrokerName.fromString('Bad/Name');
        const portfolioName = PortfolioName.fromString('Main');

        expect(() =>
            service.createFilename(brokerName, portfolioName, new Date('2026-01-01T00:00:00Z')),
        ).toThrow('invalid filename characters');
    });

    it('throws for invalid portfolio name segment', () => {
        const service = new ExportFilenameService();
        const brokerName = BrokerName.fromString('Acme');
        const portfolioName = PortfolioName.fromString('Bad:Name');

        expect(() =>
            service.createFilename(brokerName, portfolioName, new Date('2026-01-01T00:00:00Z')),
        ).toThrow('invalid filename characters');
    });
});
