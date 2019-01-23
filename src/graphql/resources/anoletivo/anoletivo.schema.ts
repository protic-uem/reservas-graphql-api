const anoLetivoTypes = `
    type AnoLetivo {
        id: ID!
        inicio_primeiro_semestre: String!
        fim_primeiro_semestre: String!
        inicio_segundo_semestre: String!
        fim_segundo_semestre: String!
        status: Int!
        departamento: Departamento!
    }

    input AnoLetivoInput {
        inicio_primeiro_semestre: String!
        fim_primeiro_semestre: String!
        inicio_segundo_semestre: String!
        fim_segundo_semestre: String!
        status: Int!
        departamento: Int!
    }
`;

const anoLetivoQueries = `
    anoLetivos(first: Int, offset: Int): [ AnoLetivo! ]!
    anoLetivo(id: ID!): AnoLetivo
`;

const anoLetivoMutations = `
    createAnoLetivo(input: AnoLetivoInput!): AnoLetivo
    updateAnoLetivo(id: ID!, input: AnoLetivoInput): AnoLetivo
    deleteAnoLetivo(id: ID!): Boolean
`;

export {
    anoLetivoTypes,
    anoLetivoQueries,
    anoLetivoMutations
}

