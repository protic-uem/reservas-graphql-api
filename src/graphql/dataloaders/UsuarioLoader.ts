import { UsuarioModel, UsuarioInstance } from "../../models/UsuarioModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class UsuarioLoader {


    //Busca os usuários de acordo com os id's
    static batchUsuarios(Usuario: UsuarioModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<UsuarioInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Usuario.findAll({
                where: { id: { $in: ids }}, //utilizando o alias IN do MYSQL
                attributes: requestedFields.getFields(params[0].info, {keep: ['id'], exclude: ['reservas', 'disciplinas']})
            })
        );    
    }

}