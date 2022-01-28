import { Router, Request, Response, NextFunction } from "express";
import { joiTemplate } from "../database/interfaces";
import CollectionsRepository from "../repositories/CollectionsRepository";
import AppError from "../shared/AppError";

const template = Router();

const mongo = new CollectionsRepository();

const collection = "template";

const ensureValidate = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = joiTemplate.validate(request.body);
  if (status.error === undefined) next();
  throw new AppError(status.error.message, 500);
};

const insert = async (request: Request, response: Response) => {
  await mongo.create({ collection, document: request.body });
  return response.status(200).send();
};

const put = async (request: Request, response: Response) => {
  const { id } = request.params;
  const document = request.body;
  await mongo.replace({ collection, id, document });
  return response.status(200).send();
};

const patch = async (request: Request, response: Response) => {
  const { id } = request.params;
  const document = request.body;
  await mongo.update({ collection, id, document });
  return response.status(200).send();
};

const remove = async (request: Request, response: Response) => {
  const { id } = request.params;
  await mongo.delete({ collection, id });
  return response.status(200).send();
};

const get = async (request: Request, response: Response) => {
  const { id } = request.params;
  await mongo.get({ collection, id });
  return response.status(200).send();
};

const getByName = async (request: Request, response: Response) => {
  const { name } = request.params;
  await mongo.getByName({ collection, name });
  return response.status(200).send();
};

template.post("", ensureValidate, insert);
template.put("/:id", ensureValidate, put);
template.patch("/:id", patch);
template.delete("/:id", remove);
template.get("/:id", get);
template.get("/:name", getByName);

export { template };
