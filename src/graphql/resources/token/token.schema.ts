const tokenTypes = `
    type Token {
        token: String!
    }
`;

const tokenMutations = `
    createToken(email: String!, senha: String!): Token
    deleteToken: Token
   `;

export {
    tokenTypes,
    tokenMutations
}