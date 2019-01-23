import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";
import { SalaModel, SalaInstance } from "../../models/SalaModel";

export class SalaLoader {

    static batchSalas(Sala: SalaModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<SalaInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Sala.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params[0].info, { keep: ['id']})
            })
        );
    }

}