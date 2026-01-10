export interface PortfoliosResponseDto {
    data: {
        account: {
            brokerPortfolios: Array<{
                id: string;
                personalizations: { name: string } | null;
            }>;
        };
    };
}
