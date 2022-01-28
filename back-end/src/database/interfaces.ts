/* eslint-disable @typescript-eslint/naming-convention */
import Joi from "joi";

export interface genericLabel {
  label: string;
  qualifier?: string | number | boolean;
  meta?: any;
}
interface _needs extends genericLabel {
  label: "REPLACEMENT" | "UPGRADE_ITEM" | "REMODEL";
}
interface _product_clusters extends genericLabel {
  label: "QUICK_PICKERS" | "STORAGE_SOLVERS" | "LASTING_COMFORT";
}
interface _triggers extends genericLabel {
  label: "PRICE" | "TIME" | "SEASON" | "EVENT" | "RETAILER" | "BUDGET";
}
interface _missions extends genericLabel {
  label: "SOLUTION_SEEKING" | "RECREATIONAL_SHOPPING";
}
interface _touchpoints extends genericLabel {
  label: "BRAND_WEBSITE" | "ECOMMERCE_STORE" | "SOCIAL_MEDIA" | "ONLINE_STORES";
}
interface _journey_phases extends genericLabel {
  label:
    | "BROWSING_FILTERING_COMPARING"
    | "EXPLORATION_LEARNING"
    | "COMMITTING_COMPLETION";
}
interface _place_of_purchase extends genericLabel {
  label: "STORE" | "ONLINE";
}

interface basicRelationships {
  client: string;
  retail: string;
  seller: string;
  product_sku: string | number;
  shelf_price: number;
  transaction_price: number;
  quantity: number;
}

interface extendedRelationships extends basicRelationships {
  events: string[];
}

interface base {
  _id: string | null;
  labels: {
    needs: _needs;
    product_clusters: _product_clusters;
    triggers: _triggers;
    missions: _missions;
    touchpoints: _touchpoints;
    journey_phases: _journey_phases;
    place_of_purchase: _place_of_purchase;
  };
}

export interface template extends base {
  name: string;
  relationships: basicRelationships;
}

export interface warehouse extends base {
  date: Date;
  data: any;
  relationships: extendedRelationships;
}

export const joiWarehouse = Joi.object({
  _id: Joi.string().allow(null),
  date: Joi.date().allow(null),
  labels: {
    needs: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    product_clusters: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    triggers: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    missions: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    touchpoints: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    journey_phases: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
    place_of_purchase: Joi.object({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }).allow(null),
  },
  relationships: {
    client: Joi.alternatives(Joi.string(), Joi.number()).allow(null),
    retail: Joi.alternatives(Joi.string(), Joi.number()).allow(null),
    seller: Joi.alternatives(Joi.string(), Joi.number()).allow(null),
    product_sku: Joi.alternatives(Joi.string(), Joi.number()).allow(null),
    shelf_price: Joi.number().allow(null),
    transaction_price: Joi.number().allow(null),
    quantity: Joi.number().allow(null),
    events: Joi.array().items(Joi.string()),
  },
  data: Joi.any(),
});

export const joiTemplate = Joi.object({
  _id: Joi.string().allow(null),
  name: Joi.string(),
  labels: Joi.object({
    needs: Joi.any().allow(null),
    product_clusters: Joi.any().allow(null),
    triggers: Joi.any().allow(null),
    missions: Joi.any().allow(null),
    touchpoints: Joi.any().allow(null),
    journey_phases: Joi.any().allow(null),
    place_of_purchase: Joi.any().allow(null),
  }).allow(null),
  relationships: Joi.object({
    client: Joi.any().allow(null),
    retail: Joi.any().allow(null),
    seller: Joi.any().allow(null),
    product_sku: Joi.any().allow(null),
    shelf_price: Joi.any().allow(null),
    transaction_price: Joi.any().allow(null),
    quantity: Joi.any().allow(null),
    events: Joi.any().allow(null),
  }).allow(null),
});
