const cursoTypes = `
    type Curso {
        id: ID!
        nome: String!
        tipo: String!
        status: Int!
        departamento: Departamento!
        disciplinas: [ Disciplina! ]!
    }

    input CursoInput {
        nome: String!
        tipo: String!
        status: Int!
        id_departamento: Int!
    }
`;

const cursoQueries = `
    cursos(first: Int, offset: Int): [ Curso! ]!
    curso(id: ID!): Curso
`;

const cursoMutations = `
    createCurso(input: CursoInput!): Curso
    updateCurso(id: ID!, input: CursoInput): Curso
    deleteCurso(id: ID!): Boolean
`;

export {
    cursoTypes,
    cursoQueries,
    cursoMutations
}

