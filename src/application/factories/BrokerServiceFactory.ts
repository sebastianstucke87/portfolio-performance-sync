import {BrokerService} from '../../domain/ports/BrokerService.js';

export class BrokerServiceFactory {
    constructor(private readonly services: BrokerService[]) {
    }

    supportsUrl(url: string): boolean {
        return this.services.some((service) => service.supportsUrl(url));
    }

    createForUrl(url: string): BrokerService {
        const service = this.services.find((candidate) => candidate.supportsUrl(url));
        if (!service) {
            throw new Error('No broker found for current URL');
        }

        return service;
    }
}
