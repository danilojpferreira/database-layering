/* eslint-disable no-use-before-define */
import { MongoClient, ObjectId } from "mongodb";

import { connect } from "../database";
import AppError from "../shared/AppError";
import {
  ICreate,
  IRequest,
  ICollectionRepository,
  IUpdate,
  IRequestByName,
} from "./ICollectionsRepository";

class CollectionsRepository implements ICollectionRepository {
  private client: Promise<MongoClient>;

  private static INSTANCE: CollectionsRepository;

  constructor() {
    this.client = connect();
  }

  public static getInstance(): CollectionsRepository {
    if (!CollectionsRepository.INSTANCE) {
      CollectionsRepository.INSTANCE = new CollectionsRepository();
    }
    return CollectionsRepository.INSTANCE;
  }

  async create({ document, collection }: ICreate): Promise<void> {
    (await this.client)
      .db("main")
      .collection(collection)
      .insertOne(document)
      .catch((err) => {
        throw new AppError(err, 404);
      });
  }

  async update({ collection, id, document }: IUpdate): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new AppError("ID must be a valid ID", 404);
    }

    const item = await (
      await this.client
    )
      .db("main")
      .collection(collection)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: document })
      .catch((err) => {
        throw new AppError(err, 404);
      });

    if (item.value === null) {
      throw new AppError("Document doesn't exist in this collection", 404);
    }
  }

  async replace({ collection, id, document }: IUpdate): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new AppError("ID must be a valid ID", 404);
    }

    const item = await (
      await this.client
    )
      .db("main")
      .collection(collection)
      .findOneAndReplace({ _id: new ObjectId(id) }, document)
      .catch((err) => {
        throw new AppError(err, 404);
      });

    if (item.value === null) {
      throw new AppError("Document doesn't exist in this collection", 404);
    }
  }

  async delete({ collection, id }: IRequest): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new AppError("ID must be a valid ID", 404);
    }

    const item = await (
      await this.client
    )
      .db("main")
      .collection(collection)
      .findOneAndDelete({ _id: new ObjectId(id) })
      .catch((err) => {
        throw new AppError(err, 404);
      });

    if (!item.value) {
      throw new AppError("Document doesn't exist in this collection", 404);
    }
  }

  async get({ collection, id }: IRequest): Promise<any> {
    const item = await (
      await this.client
    )
      .db()
      .collection(collection)
      .findOne({ _id: new ObjectId(id) })
      .catch((err) => console.log(err));

    return item;
  }

  async getByName({ collection, name }: IRequestByName): Promise<any> {
    const item = await (
      await this.client
    )
      .db()
      .collection(collection)
      .findOne({ name })
      .catch((err) => console.log(err));

    return item;
  }
}

export default CollectionsRepository;
