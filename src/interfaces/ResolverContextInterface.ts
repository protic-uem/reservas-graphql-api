import { DbConnection } from "./DbConnectionInterface";
import { AuthUsuario } from "./AuthUsuarioInterface";
import { DataLoaders } from "./DataLoadersInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {

    db?: DbConnection;
    authorization?: string;
    authUsuario?: AuthUsuario;
    dataloaders?: DataLoaders;
    requestedFields?: RequestedFields;

}