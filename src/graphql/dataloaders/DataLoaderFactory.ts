import * as DataLoader from 'dataloader';

import { DbConnection } from "../../interfaces/DbConnectionInterface";
import { DataLoaders } from "../../interfaces/DataLoadersInterface";
import { UsuarioLoader } from './UsuarioLoader';
import { UsuarioInstance } from '../../models/UsuarioModel';
import { ReservaInstance } from '../../models/ReservaModel';
import { ReservaLoader } from './ReservaLoaders';
import { RequestedFields } from '../ast/RequestedFields';
import { DataLoaderParam } from '../../interfaces/DataLoaderParamInterface';
import { DepartamentoInstance } from '../../models/DepartamentoModel';
import { DepartamentoLoader } from './DepartamentoLoader';
import { CursoInstance } from '../../models/CursoModel';
import { CursoLoader } from './CursoLoader';
import { SalaInstance } from '../../models/SalaModel';
import { SalaLoader } from './SalaLoader';
import { DisciplinaInstance } from '../../models/DisciplinaModel';
import { DisciplinaLoader } from './DisciplinaLoader';

/**
 * Loaders servem para deixar a performance da aplicação melhor
 * Em relações 1 para N, o loader sempre vai na entidade com a cadinalidade 1
 * Ao invés de fazer várias buscas pelos mesmos dados(N), ele busca somente uma vez
 * Exemplo: Um departamento tem vários cursos, logo temos o loaderDepartamento
 */
export class DataLoaderFactory {

    constructor(
        private db: DbConnection,
        private requestedFields: RequestedFields
    ) {}

    getLoaders(): DataLoaders {
        return {
            usuarioLoader: new DataLoader<DataLoaderParam<number>, UsuarioInstance>(
                (params: DataLoaderParam<number>[]) => UsuarioLoader.batchUsuarios(this.db.Usuario, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            reservasLoader: new DataLoader<DataLoaderParam<number>, ReservaInstance>(
                (params: DataLoaderParam<number>[]) => ReservaLoader.batchReservas(this.db.Reserva, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            departamentoLoader: new DataLoader<DataLoaderParam<number>, DepartamentoInstance>(
                (params: DataLoaderParam<number>[]) => DepartamentoLoader.batchDepartamentos(this.db.Departamento, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            cursoLoader: new DataLoader<DataLoaderParam<number>, CursoInstance>(
                (params: DataLoaderParam<number>[]) => CursoLoader.batchCursos(this.db.Curso, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            salaLoader: new DataLoader<DataLoaderParam<number>, SalaInstance>(
                (params: DataLoaderParam<number>[]) => SalaLoader.batchSalas(this.db.Sala, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            disciplinaLoader:  new DataLoader<DataLoaderParam<number>, DisciplinaInstance>(
                (params: DataLoaderParam<number>[]) => DisciplinaLoader.batchDisciplinas(this.db.Disciplina, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            )
        };
    }

}