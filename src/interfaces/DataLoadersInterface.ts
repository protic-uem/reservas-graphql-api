import * as DataLoader from 'dataloader';

import { DataLoaderParam } from './DataLoaderParamInterface';
import { UsuarioInstance } from '../models/UsuarioModel';
import { ReservaInstance } from '../models/ReservaModel';
import { DepartamentoInstance } from '../models/DepartamentoModel';
import { CursoLoader } from '../graphql/dataloaders/CursoLoader';
import { SalaLoader } from '../graphql/dataloaders/SalaLoader';
import { DisciplinaLoader } from '../graphql/dataloaders/DisciplinaLoader';

export interface DataLoaders {

    usuarioLoader: DataLoader<DataLoaderParam<number>, UsuarioInstance>;
    reservasLoader: DataLoader<DataLoaderParam<number>, ReservaInstance>;
    departamentoLoader: DataLoader<DataLoaderParam<number>, DepartamentoInstance>;
    cursoLoader: DataLoader<DataLoaderParam<number>, CursoLoader>;
    salaLoader: DataLoader<DataLoaderParam<number>, SalaLoader>;
    disciplinaLoader: DataLoader<DataLoaderParam<number>, DisciplinaLoader>;


}