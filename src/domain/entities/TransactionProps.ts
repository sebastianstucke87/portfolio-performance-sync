import {Isin} from '../value-objects/Isin.js';
import {Money} from '../value-objects/Money.js';
import {TransactionDate} from '../value-objects/TransactionDate.js';
import {TransactionType} from '../value-objects/TransactionType.js';

export interface TransactionProps {
    readonly id: string;
    readonly date: TransactionDate;
    readonly type: TransactionType;
    readonly amount: Money;
    readonly isin: Isin | null;
    readonly wkn: string | null;
    readonly shares: number | null;
    readonly description: string;
    readonly note: string | null;
}
