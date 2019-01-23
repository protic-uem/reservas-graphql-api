const departamentoTypes = `
    type Departamento {
        id: ID!
        nome: String!
        descricao: String!
        status: Int!
        salas: [ Sala! ]!
        disciplinas: [ Disciplina! ]!
        cursos: [ Curso! ]!
        usuarios: [ Usuario! ]!
        reservas: [ Reserva! ]!
    }

    input DepartamentoInput {
        nome: String!
        descricao: String!
        status: Int!
    }
`;

const departamentoQueries = `
    departamentos(first: Int, offset: Int): [ Departamento! ]!
    departamento(id: ID!): Departamento
`;

const departamentoMutations = `
    createDepartamento(input: DepartamentoInput!): Departamento
    updateDepartamento(id: ID!, input: DepartamentoInput): Departamento
    deleteDepartamento(id: ID!): Boolean
`;

export {
    departamentoTypes,
    departamentoQueries,
    departamentoMutations
}

