import {TransactionResponseDto} from './TransactionResponseDto.js';

export interface MoreTransactionsResponseDto {
    cursor: string | null;
    total: number;
    transactions: TransactionResponseDto[];
}
