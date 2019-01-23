const disciplinaTypes = `
    type Disciplina {
        id: ID!
        codigo: Int!
        nome: String!
        periodo: String!
        turma: Int!
        tipo: String!
        status: Int!
        departamento: Departamento!
        curso: Curso!
        usuario: Usuario!
    }

    input DisciplinaInput {
        codigo: Int!
        nome: String!
        periodo: String!
        turma: Int!
        tipo: String!
        status: Int!
        id_departamento: Int!
        id_curso: Int!
        id_usuario: Int!
    }
`;

const disciplinaQueries = `
    disciplinas(first: Int, offset: Int): [ Disciplina! ]!
    disciplina(id: ID!): Disciplina
    disciplinasPorDepartamento(departamentoID: ID!, first: Int, offset: Int): [ Disciplina! ]!
    disciplinasPorUsuario(usuarioID: ID!, first: Int, offset: Int): [ Disciplina! ]!
`;

const disciplinaMutations = `
    createDisciplina(input: DisciplinaInput!): Disciplina
    updateDisciplina(id: ID!, input: DisciplinaInput): Disciplina
    deleteDisciplina(id: ID!): Boolean
`;

export {
    disciplinaTypes,
    disciplinaQueries,
    disciplinaMutations
}

