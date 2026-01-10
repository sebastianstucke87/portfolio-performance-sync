export const MORE_TRANSACTIONS_QUERY = `
query moreTransactions($personId: ID!, $input: BrokerTransactionInput!, $portfolioId: ID!) {
  account(id: $personId) {
    id
    brokerPortfolio(id: $portfolioId) {
      id
      moreTransactions(input: $input) {
        cursor
        total
        transactions {
          id
          currency
          type
          status
          isCancellation
          lastEventDateTime
          description
          ... on BrokerCashTransactionSummary {
            cashTransactionType
            amount
            relatedIsin
          }
          ... on BrokerNonTradeSecurityTransactionSummary {
            nonTradeSecurityTransactionType
            quantity
            amount
            isin
          }
          ... on BrokerSecurityTransactionSummary {
            securityTransactionType
            quantity
            amount
            side
            isin
          }
        }
      }
    }
  }
}
`.trim();

export const GET_BROKER_PORTFOLIOS_QUERY = `
query getBrokerPortfolios($personId: ID!) {
  account(id: $personId) {
    brokerPortfolios(custodianBanks: [SCALABLE]) {
      id
      personalizations { name }
    }
  }
}
`.trim();
