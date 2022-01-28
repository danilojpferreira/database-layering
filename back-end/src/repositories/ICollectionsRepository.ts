import { InsertOneResult } from "mongodb";

export interface IRequest {
  collection: string;
  id: string;
}

export interface IRequestByName {
  collection: string;
  name: string;
}

export interface ICreate {
  document: Object;
  collection: string;
}

export interface IUpdate {
  collection: string;
  id: string;
  document: Object;
}

interface ICollectionRepository {
  create({ document, collection }: ICreate): Promise<InsertOneResult<Document>>;
  update({ collection, id, document }: IUpdate): Promise<void>;
  replace({ collection, id, document }: IUpdate): Promise<void>;
  delete({ collection, id }: IRequest): Promise<void>;
  get({ collection, id }: IRequest): Promise<any>;
}

export { ICollectionRepository };
