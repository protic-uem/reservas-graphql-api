import { ReservaModel, ReservaInstance } from "../../models/ReservaModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class ReservaLoader {

    static batchReservas(Reserva: ReservaModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<ReservaInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Reserva.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params[0].info, { keep: ['id']})
            })
        );
    }

}