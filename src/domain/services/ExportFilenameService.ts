import {BrokerName} from '../value-objects/BrokerName.js';
import {PortfolioName} from '../value-objects/PortfolioName.js';

const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/;

export class ExportFilenameService {
    createFilename(brokerName: BrokerName, portfolioName: PortfolioName, timestamp: Date): string {
        const brokerSegment = this.toSegment('Broker name', brokerName.toString());
        const portfolioSegment = this.toSegment('Portfolio name', portfolioName.toString());
        const dateSegment = this.formatDate(timestamp);
        const timeSegment = this.formatTime(timestamp);

        return `${brokerSegment}-${portfolioSegment}-${dateSegment}${timeSegment}.csv`;
    }

    private toSegment(label: string, value: string): string {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error(`${label} must not be empty`);
        }

        if (INVALID_FILENAME_CHARS.test(trimmed)) {
            throw new Error(`${label} contains invalid filename characters`);
        }

        return trimmed;
    }

    private formatDate(timestamp: Date): string {
        return timestamp.toISOString().slice(0, 10);
    }

    private formatTime(timestamp: Date): string {
        return timestamp.toISOString().slice(11, 19).replace(/:/g, '-');
    }
}
