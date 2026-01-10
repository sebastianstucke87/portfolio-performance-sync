import {ApiError} from '../../domain/errors/ApiError.js';

const GRAPHQL_PATH = '/cockpit/graphql';

export interface GraphQLOperation {
    operationName: string;
    variables: Record<string, unknown>;
    query: string;
}

export class GraphQLClient {
    constructor(private readonly baseUrl: string) {
    }

    async query<T>(operations: GraphQLOperation[]): Promise<T[]> {
        const response = await fetch(this.baseUrl + GRAPHQL_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(operations),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new ApiError(response.status, body);
        }

        const data = await response.json();
        return data as T[];
    }
}
