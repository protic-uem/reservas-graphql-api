import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { difference, union } from 'lodash';


export class RequestedFields {

    getFields(info: GraphQLResolveInfo, options?: {keep?: string[], exclude?: string[]}): any[] {

        let fields: string[] = Object.keys(graphqlFields(info));
        if(!options) {
            return fields;
        }
        fields = (options.keep)? union<string>(fields, options.keep):fields;
        return (options.exclude)? difference<string>(fields, options.exclude): fields;

    }

}