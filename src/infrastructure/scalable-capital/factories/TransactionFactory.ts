import {Transaction} from '../../../domain/entities/Transaction.js';
import {Isin} from '../../../domain/value-objects/Isin.js';
import {Money} from '../../../domain/value-objects/Money.js';
import {TransactionDate} from '../../../domain/value-objects/TransactionDate.js';
import {TransactionType} from '../../../domain/value-objects/TransactionType.js';
import {UnknownTransactionTypeError} from '../../../domain/errors/UnknownTransactionTypeError.js';
import {TransactionResponseDto} from '../dto/TransactionResponseDto.js';

export class TransactionFactory {
    createFromDto(dto: TransactionResponseDto): Transaction {
        const type = this.mapType(dto);
        const isin = this.extractIsin(dto);

        return Transaction.create({
            id: dto.id,
            date: TransactionDate.create(dto.lastEventDateTime),
            type,
            amount: Money.create(Math.abs(dto.amount), dto.currency),
            isin,
            wkn: null,
            shares: dto.quantity ?? null,
            description: dto.description,
            note: this.createNote(dto),
        });
    }

    private mapType(dto: TransactionResponseDto): TransactionType {
        if (dto.type === 'SECURITY_TRANSACTION') {
            return this.mapSecurityTransactionType(dto);
        }

        if (dto.type === 'NON_TRADE_SECURITY_TRANSACTION') {
            return this.mapNonTradeSecurityTransactionType(dto);
        }

        if (dto.type === 'CASH_TRANSACTION') {
            return this.mapCashTransactionType(dto);
        }

        throw new UnknownTransactionTypeError(dto);
    }

    private mapSecurityTransactionType(dto: TransactionResponseDto): TransactionType {
        if (dto.side === 'SELL') {
            return TransactionType.Sell;
        }

        return TransactionType.Buy;
    }

    private mapNonTradeSecurityTransactionType(dto: TransactionResponseDto): TransactionType {
        if (dto.nonTradeSecurityTransactionType === 'TRANSFER_IN') {
            return TransactionType.TransferInbound;
        }

        if (dto.nonTradeSecurityTransactionType === 'TRANSFER_OUT') {
            return TransactionType.TransferOutbound;
        }

        throw new UnknownTransactionTypeError(dto);
    }

    private mapCashTransactionType(dto: TransactionResponseDto): TransactionType {
        switch (dto.cashTransactionType) {
            case 'DIVIDEND':
                return TransactionType.Dividend;
            case 'INTEREST':
                return TransactionType.Interest;
            case 'TAX':
                return TransactionType.Taxes;
            case 'FEE':
                return TransactionType.Fees;
            case 'DEPOSIT':
                return TransactionType.Deposit;
            case 'WITHDRAWAL':
                return TransactionType.Removal;
            default:
                throw new UnknownTransactionTypeError(dto);
        }
    }

    private extractIsin(dto: TransactionResponseDto): Isin | null {
        const isinStr = dto.isin ?? dto.relatedIsin;
        if (!isinStr) {
            return null;
        }

        return Isin.create(isinStr);
    }

    private createNote(dto: TransactionResponseDto): string | null {
        if (dto.securityTransactionType === 'SAVINGS_PLAN') {
            return 'Savings plan execution';
        }

        return null;
    }
}
