/* eslint-disable @typescript-eslint/naming-convention */
import Joi from "joi";

interface genericLabel {
  label: string;
  qualifier: string | number | boolean;
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

interface base {
  _id: string;
  labels: {
    needs: _needs[];
    product_clusters: _product_clusters[];
    triggers: _triggers[];
    missions: _missions[];
    touchpoints: _touchpoints[];
    journey_phases: _journey_phases[];
    place_of_purchase: _place_of_purchase[];
  };
  relationships: {
    client: string;
    retail: string;
    seller: string;
    product_sku: string | number;
    shelf_price: number;
    transaction_price: number;
    quantity: number;
    events: string[];
  };
}
interface template extends base {
  name: string;
}

interface warehouse extends base {
  date: Date;
  data: any;
}

export const joiWarehouse = Joi.object({
  _id: Joi.string().allow(null),
  date: Joi.date().allow(null),
  labels: {
    needs: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    product_clusters: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    triggers: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    missions: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    touchpoints: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    journey_phases: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
    place_of_purchase: Joi.array().items({
      label: Joi.string(),
      qualifier: Joi.alternatives(Joi.string, Joi.number, Joi.boolean).allow(
        null
      ),
      meta: Joi.any().allow(null),
    }),
  },
  relationships: {
    client: Joi.string().allow("", null),
    retail: Joi.string().allow("", null),
    seller: Joi.string().allow("", null),
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
  labels: {
    needs: Joi.string(),
    product_clusters: Joi.string(),
    triggers: Joi.string(),
    missions: Joi.string(),
    touchpoints: Joi.string(),
    journey_phases: Joi.string(),
    place_of_purchase: Joi.string(),
  },
  relationships: {
    client: Joi.string().allow("", null),
    retail: Joi.string().allow("", null),
    seller: Joi.string().allow("", null),
    product_sku: Joi.string().allow("", null),
    shelf_price: Joi.string().allow("", null),
    transaction_price: Joi.string().allow("", null),
    quantity: Joi.string().allow("", null),
    events: Joi.string(),
  },
});
