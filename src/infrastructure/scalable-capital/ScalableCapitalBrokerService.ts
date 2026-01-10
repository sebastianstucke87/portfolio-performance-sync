import {BrokerService} from '../../domain/ports/BrokerService.js';
import {BrokerName} from '../../domain/value-objects/BrokerName.js';
import {Portfolio} from '../../domain/entities/Portfolio.js';
import {PortfolioId} from '../../domain/value-objects/PortfolioId.js';
import {PortfolioName} from '../../domain/value-objects/PortfolioName.js';
import {Transaction} from '../../domain/entities/Transaction.js';
import {GraphQLClient} from './GraphQLClient.js';
import {TransactionFactory} from './factories/TransactionFactory.js';
import {SessionExtractor} from '../browser/SessionExtractor.js';
import {GET_BROKER_PORTFOLIOS_QUERY, MORE_TRANSACTIONS_QUERY} from './queries.js';
import {PortfoliosResponseDto} from './dto/PortfoliosResponseDto.js';
import {GraphQLResponseDto} from './dto/GraphQLResponseDto.js';
import {MoreTransactionsResponseDto} from './dto/MoreTransactionsResponseDto.js';

const SUPPORTED_DOMAIN = 'scalable.capital';

export class ScalableCapitalBrokerService implements BrokerService {
    private static readonly BROKER_NAME = BrokerName.fromString('Scalable Capital');

    constructor(
        private readonly client: GraphQLClient,
        private readonly transactionFactory: TransactionFactory,
        private readonly sessionExtractor: SessionExtractor,
    ) {
    }

    supportsUrl(url: string): boolean {
        return url.includes(SUPPORTED_DOMAIN);
    }

    getName(): BrokerName {
        return ScalableCapitalBrokerService.BROKER_NAME;
    }

    async getPortfolios(): Promise<Portfolio[]> {
        const personId = this.sessionExtractor.extractPersonId();
        const [response] = await this.client.query<PortfoliosResponseDto>([
            {
                operationName: 'getBrokerPortfolios',
                variables: {personId},
                query: GET_BROKER_PORTFOLIOS_QUERY,
            },
        ]);

        return response.data.account.brokerPortfolios.map((portfolio) => {
            const name = portfolio.personalizations?.name ?? 'Portfolio';

            return new Portfolio(
                PortfolioId.fromString(portfolio.id),
                PortfolioName.fromString(name),
            );
        });
    }

    async getTransactions(portfolio: Portfolio): Promise<Transaction[]> {
        const transactions: Transaction[] = [];
        let cursor: string | null = null;
        const personId = this.sessionExtractor.extractPersonId();

        do {
            const [response] = await this.client.query<GraphQLResponseDto>([
                {
                    operationName: 'moreTransactions',
                    variables: {
                        personId,
                        portfolioId: portfolio.getId().toString(),
                        input: {
                            pageSize: 250,
                            type: [],
                            status: [],
                            searchTerm: '',
                            isin: null,
                            cursor,
                        },
                    },
                    query: MORE_TRANSACTIONS_QUERY,
                },
            ]);

            const moreTransactions: MoreTransactionsResponseDto =
                response.data.account.brokerPortfolio.moreTransactions;

            for (const dto of moreTransactions.transactions) {
                if (dto.isCancellation || dto.status === 'CANCELLED') {
                    continue;
                }

                transactions.push(this.transactionFactory.createFromDto(dto));
            }

            cursor = moreTransactions.cursor;
        } while (cursor !== null);

        return transactions;
    }
}
