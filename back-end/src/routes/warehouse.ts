import { NextFunction, Router, Request, Response } from "express";
import { joiWarehouse } from "../database/interfaces";

import CollectionsRepository from "../repositories/CollectionsRepository";
import AppError from "../shared/AppError";
import { castTemplate } from "../shared/functions";

const warehouse = Router();

const mongo = new CollectionsRepository();

const collection = "warehouse";

const ensureValidate = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = joiWarehouse.validate(request.body);
  if (status.error === undefined) next();
  else throw new AppError(status.error.message, 500);
};

const parseTemplate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const queryTemplate = request.query.template ?? "";
  const document = request.body;
  const template = await mongo.getByName({
    collection: "template",
    name: queryTemplate.toString(),
  });
  const parsedData = castTemplate({ template, document });
  request.body = parsedData;
  next();
};

const insert = async (request: Request, response: Response) => {
  const insertion = await mongo.create({ collection, document: request.body });
  return response.json(insertion).status(200).send();
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
  const r = await mongo.get({ collection, id });
  return response.json(r).status(200).send();
};

warehouse.post("", parseTemplate, ensureValidate, insert);
warehouse.put("/:id", parseTemplate, ensureValidate, put);
warehouse.patch("/:id", patch);
warehouse.delete("/:id", remove);
warehouse.get("/:id", get);

export { warehouse };
