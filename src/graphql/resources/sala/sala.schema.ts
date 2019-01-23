const salaTypes = `
    type Sala {
        id: ID!
        numero: Int!
        descricao: String
        tipo: String!
        status: Int!
        capacidade: Int!
        departamento: Departamento!
    }

    input SalaInput {
        numero: Int!
        descricao: String
        tipo: String!
        status: Int!
        capacidade: Int!
        id_departamento: Int!
    }
`;

const salaQueries = `
    salas(first: Int, offset: Int): [ Sala! ]!
    sala(id: ID!): Sala
    salasPorDepartamento(departamentoID: ID!, first: Int, offset: Int): [ Sala! ]!
    salasDisponiveisPorDepartamentoDiaPeriodo(departamentoID: ID!, data: String!, periodo: Int!, tipo: String, first: Int, offset: Int): [ Sala! ]!
    salasDisponiveisPorDepartamentoDiaPeriodoTipo(departamentoID: ID!, data: String!, periodo: Int!, tipo: String!, first: Int, offset: Int): [ Sala! ]!
`;

const salaMutations = `
    createSala(input: SalaInput!): Sala
    updateSala(id: ID!, input: SalaInput): Sala
    deleteSala(id: ID!): Boolean
`;

export {
    salaTypes,
    salaQueries,
    salaMutations
}

