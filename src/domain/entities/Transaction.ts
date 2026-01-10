import {TransactionProps} from './TransactionProps.js';
import {Isin} from '../value-objects/Isin.js';
import {Money} from '../value-objects/Money.js';
import {TransactionDate} from '../value-objects/TransactionDate.js';
import {TransactionType} from '../value-objects/TransactionType.js';

export class Transaction {
    private constructor(private readonly props: TransactionProps) {
    }

    get id(): string {
        return this.props.id;
    }

    get date(): TransactionDate {
        return this.props.date;
    }

    get type(): TransactionType {
        return this.props.type;
    }

    get amount(): Money {
        return this.props.amount;
    }

    get isin(): Isin | null {
        return this.props.isin;
    }

    get wkn(): string | null {
        return this.props.wkn;
    }

    get shares(): number | null {
        return this.props.shares;
    }

    get description(): string {
        return this.props.description;
    }

    get note(): string | null {
        return this.props.note;
    }

    static create(props: TransactionProps): Transaction {
        if (!props.id) {
            throw new Error('Transaction ID is required');
        }

        return new Transaction(props);
    }
}
