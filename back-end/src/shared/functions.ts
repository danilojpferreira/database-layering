import Joi from "joi";
import { warehouse } from "../database/interfaces";
import AppError from "./AppError";

interface ICastTemplate {
  template: any;
  document: any;
}

const isRow = Joi.any().allow(null);

const isLabel = Joi.object({
  label: Joi.string(),
  qualifier: Joi.alternatives(Joi.string(), Joi.number(), Joi.boolean()),
  meta: Joi.any(),
}).allow(null);

export const castTemplate = ({ template, document }: ICastTemplate) => {
  const tranformData = (expected: Joi.Schema, ...args: string[]) => {
    const templateField: any = template[args[0]][args[1]];
    let response: any = null;
    if (typeof templateField === "string") {
      if (templateField.startsWith("$")) {
        const paths = templateField.substring(1).split(".");
        let root: any = document;
        // eslint-disable-next-line no-restricted-syntax
        for (const path of paths) {
          root = root[path];
        }
        if (expected === isRow) {
          response = root;
        } else {
          response = {
            label: root,
          };
        }
      } else if (templateField.startsWith("function")) {
        // eslint-disable-next-line prefer-const
        let funct = () => null;
        eval(`funct = ${templateField}`);
        response = funct();
      } else {
        response = {
          label: templateField ?? "",
        };
      }
    } else if (expected === isRow) {
      response = templateField;
    }
    const valid = expected.validate(response);
    if (valid.error === undefined) {
      return response;
    }
    throw new AppError(valid.error.message, 500);
  };

  const newDocument: warehouse = {
    date: new Date(),
    data: document,
    _id: document._id ?? null,
    relationships: {
      client: tranformData(isRow, "relationships", "client"),
      retail: tranformData(isRow, "relationships", "retail"),
      seller: tranformData(isRow, "relationships", "seller"),
      product_sku: tranformData(isRow, "relationships", "product_sku"),
      shelf_price: tranformData(isRow, "relationships", "shelf_price"),
      transaction_price: tranformData(
        isRow,
        "relationships",
        "transaction_price"
      ),
      quantity: tranformData(isRow, "relationships", "quantity"),
      events: [],
    },
    labels: {
      needs: tranformData(isLabel, "labels", "needs"),
      product_clusters: tranformData(isLabel, "labels", "product_clusters"),
      triggers: tranformData(isLabel, "labels", "triggers"),
      missions: tranformData(isLabel, "labels", "missions"),
      touchpoints: tranformData(isLabel, "labels", "touchpoints"),
      journey_phases: tranformData(isLabel, "labels", "journey_phases"),
      place_of_purchase: tranformData(isLabel, "labels", "place_of_purchase"),
    },
  };

  return newDocument;
};
