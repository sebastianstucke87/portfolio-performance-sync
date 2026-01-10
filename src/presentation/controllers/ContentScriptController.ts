import {GetPortfoliosQuery} from '../../application/use-cases/GetPortfoliosQuery.js';
import {ExportTransactionsCommand} from '../../application/use-cases/ExportTransactionsCommand.js';
import {PortfolioDto} from '../dto/PortfolioDto.js';
import {Portfolio} from '../../domain/entities/Portfolio.js';
import {PortfolioId} from '../../domain/value-objects/PortfolioId.js';
import {PortfolioName} from '../../domain/value-objects/PortfolioName.js';

export class ContentScriptController {
    constructor(
        private readonly getPortfoliosQuery: GetPortfoliosQuery,
        private readonly exportTransactionsCommand: ExportTransactionsCommand,
    ) {
    }

    register(): void {
        chrome.runtime.onMessage.addListener((rawMessage, _sender, sendResponse) => {
            const message = rawMessage as { action?: string; portfolios?: PortfolioDto[] };
            const url = window.location.href;

            if (message.action === 'getPortfolios') {
                this.getPortfolios(url)
                    .then((portfolios) => sendResponse({portfolios}))
                    .catch((error) => {
                        sendResponse({error: this.toErrorMessage(error)});
                        throw error;
                    });

                return true;
            }

            if (message.action === 'export') {
                if (!Array.isArray(message.portfolios)) {
                    throw new Error('Invalid export request');
                }

                this.export(url, message.portfolios)
                    .then(() => sendResponse({}))
                    .catch((error) => {
                        sendResponse({error: this.toErrorMessage(error)});
                        throw error;
                    });

                return true;
            }

            return false;
        });
    }

    private async getPortfolios(url: string): Promise<PortfolioDto[]> {
        const portfolios = await this.getPortfoliosQuery.execute(url);

        return portfolios.map((portfolio) => this.toDto(portfolio));
    }

    private async export(url: string, portfolios: PortfolioDto[]): Promise<void> {
        const domainPortfolios = portfolios.map((portfolio) => this.toDomain(portfolio));
        await this.exportTransactionsCommand.execute(url, domainPortfolios);
    }

    private toDto(portfolio: Portfolio): PortfolioDto {
        return {
            id: portfolio.getId().toString(),
            name: portfolio.getName().toString(),
        };
    }

    private toDomain(portfolio: PortfolioDto): Portfolio {
        return new Portfolio(
            PortfolioId.fromString(portfolio.id),
            PortfolioName.fromString(portfolio.name),
        );
    }

    private toErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
}
