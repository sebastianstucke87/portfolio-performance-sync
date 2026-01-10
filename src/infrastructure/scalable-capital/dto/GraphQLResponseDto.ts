import {MoreTransactionsResponseDto} from './MoreTransactionsResponseDto.js';

export interface GraphQLResponseDto {
    data: {
        account: {
            brokerPortfolio: {
                moreTransactions: MoreTransactionsResponseDto;
            };
        };
    };
}
