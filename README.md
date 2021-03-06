<h1 align="center">
	Database-Layering
</h1>

<p align="center">
  This project comprises backend and database solutions to create a underlying database, as part of the Assessment.
</p>

<p align="center">
	<a href="#about">About</a> •
	<a href="#instalation">Instalation</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#example">Example</a> •
	<a href="#authors">Authors</a>
</p>

# About

This project has two main applications:

    1 - Backend, an Restuful API built with Node.JS and Express.JS, that ingest and parse data to datalake/warehouse. The application use typescript and http protocol.
    2 - Database, an Instance of MongoDB, that store the templates and the lake, and share it, using with the Backend when requested.

# Instalation

There is an installation and usage guide, it is recommended to use Docker, it makes configuring apps very simple. However, you can install and run it manually, so there is a guide for each application in this project.

## Requirements and Install

Easily, you can only use Docker (https://www.docker.com/products/docker-desktop), and no need install any additional software.

Otherwise, if you prefer to run this project without a virtualization service (container), you need to have the following software installed and running on your environment:

1. MongoDB version 4+: https://docs.mongodb.com/manual/installation/
2. Node.JS at version 17.2.0: https://nodejs.org/
3. Node package manager (as npm or yarn. In this project we're usign npm at version 8.1.4): https://docs.npmjs.com/cli/v8/configuring-npm/install

   If you are using Macbook, `Homebrew` it is recommended to install all necessary software, respectively the formulaes mongodb-community and node@14.

## Execute

### With Docker

Ensure you have docker and docker-compose installed on your system. Usually, docker-compose comes with Docker Desktop. Then, you should to open a new terminal tab, go to project folder (root) and type:

```bash
docker-compose build && docker-compose up
```

When you finish, to close the application use the command:

```bash
docker-compose down
```

### Without Docker

#### MongoDB

First you need to ensure it is a running mongodb server instance. Usually, to run a mongodb instance you need to open a new terminal and type the following code:

```bash
mongod
```

In general, it will run on `localhost` (or `127.0.0.1`) on port `27017`. When running your mongodb node, you will see the host information, and if it is different from the default value, update the .env file in the root of the backend project, following the .env.example provided, with a full address in the MONGO_URI field.

Assuming you have a mongodb instance running and with the data, now it's time to insert the data into your server. You must open a new terminal and move to the database folder.

It will create the database used to serve the backend application. After running this code successfully, it's time to run the backend application.

#### Backend

Go to the backend folder with your terminal. You must have node.js and your favorite node package manager installed. We'll use npm in the following examples, but you can use yarn and just change the `npm run` or `npm` command to `yarn` in each bash. Install node modules and start your server with the command:

```bash
npm install && npm run start
```

It should start your backend server. By default, the server starts on localhost on port 3000, you can change this with the PORT property on .env file.

# Documentation

## Understanding the project

Database-Layering aims to implement a data dictionary for building a datalake/data warehouse. This means that any data source, which provides its data as JSON over http protocol, can be stored in this database.

As part of the concept around the datalake/data warehouse, the data needs to be labeled, as determined by the product. This means that each data received (call `third-party data`) to be added must go through an algorithm that partially understands its structure and performs such labeling. The approach used in this project is the creation of `templates`. A `template` is a JSON/BSON file which carries the information on how to fill the labels and/or relationships that a `third-party data` has.

On practice, it works receivind `third-party data` and casting it to a `warehouse data` usign the `template model`

`third-party data` + `template` = `warehouse data`

### third-party data

`Third-party data` refers to any data, in any structure, that is transmitted by this Restful API protocol (http) in JSON format, which is the standard for web applications.

### Template

A `template` file is a JSON structure used to cast `third-party data` in a `warehouse data`, which is the raw data, inserted from some labels that helped when performing data analysis. The `template` has the following structure:

```typescript
interface template {
  _id: string; // The unique identifier generated by MongoDB
  name: string; // Template name, used to identify the template, including the transformation of data for the warehouse
  labels: {
    // Warehouse data labels.
    needs: string | null;
    product_clusters: string | null;
    triggers: string | null;
    missions: string | null;
    touchpoints: string | null;
    journey_phases: string | null;
    place_of_purchase: string | null;
  };
  relationships: {
    // Relationships data.
    client: string | number | null;
    retail: string | number | null;
    seller: string | number | null;
    product_sku: string | number | null;
    shelf_price: number | null;
    transaction_price: number | null;
    quantity: number | null;
  };
}
```

Two data structures are very important and not very instinctive in `template`: labels and relationships.

This structures have properties that can contain a null value, string ou number. a null value indicates that data using this template will not have the indicated property. A number will set this number in the labels/relationships field on `warehouse data`, and a string is a wildcard that can be:

#### A reference to a field:

If the value (string) of the property starts with the character `$`, it indicates that the information that fills this label is present in the `third-party data`.

Imagine that the `third-party data` has the "local" field, which is inside a "sale" object, whose value can be "STORE" or "ONLINE". So, to fill in the correct label in the `warehouse data` you can say that _"labels.place_of_purchase" : "$sale.local"_
Example:

1. `Template file`

```json
{
    "name": "source_1",
    "labels": {
        ...
        "place_of_purchase": "$sale.local"
    },
    ...
}
```

2. `third-party data`

```json
{
    "sale": {
        ...
        "local": "ONLINE"
    },
    ...
}
```

3. `Warehouse data`

```json
{
  ...
  "labels": {
      ...
      "place_of_purchase": {
        "label" : "ONLINE"
      }
  },
  "data": {
    ...
    "sale":{
      ...
      "local" : "ONLINE"
    }
  }
}
```

#### A function:

If the value (string) of the property starts with `function`, it indicates that the information that fills this tag is the return of a vanilla javascript function. In this context you can access `template` using the <u>template</u> variable and access the `third-party data` with the <u>document</u> variable. You can still validate the return by running <u>expected.validate(YOUR_RETURN)</u>, in case you want to make a function that has an escape.

1. `Template file`

```json
{
    "name": "source_1",
    "relationships": {
        ...
        "transaction_price": "function a(){return document.price - (document.price * document.discount)}",
    },
    ...
}
```

2. `third-party data`

```json
{
  "price": 450.2,
  "discount": 0.2,
    ...
}
```

3. `Warehouse data`

```json
{
  ...
  "relationships": {
      ...
      "transaction_price": 360.16
  },
  "data": {
    ...
    "price": 450.2,
    "discount": 0.2,
  }
}
```

#### A string:

If the value (string) of the property not starts with `$` or `function`, it indicates that the information that fills this tag is the value of the string itself.

1. `Template file`

```json
{
    "name": "source_1",
    "relationships": {
        ...
        "seller": "Danilo Pereira",
    },
    ...
}
```

2. `third-party data`

```json
{
    ...
}
```

3. `Warehouse data`

```json
{
  ...
  "relationships": {
      ...
      "seller": "Danilo Pereira"
  },
  "data": {
    ...
  }
}
```

### Warehouse data

`Warehouse data` refers to final data stored on our warehouse/lake, this data has a semi-structure, with labels and relationships based on `template` and with all `third-party data`. This data has the following base structure:

```typescript
interface warehouse_data {
  _id: string; // The unique identifier generated by MongoDB
  labels: {
    // Labels used to aggregate and query data to get insights. Each label has a type (PROPERTY.label), and can have a qualifier (string, number or boolean) that enriches the earned label, and a meta (any) that represent any aditional data.
    needs: {
      label: "REPLACEMENT" | "UPGRADE_ITEM" | "REMODEL";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    product_clusters: {
      label: "QUICK_PICKERS" | "STORAGE_SOLVERS" | "LASTING_COMFORT";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    triggers: {
      label: "PRICE" | "TIME" | "SEASON" | "EVENT" | "RETAILER" | "BUDGET";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    missions: {
      label: "SOLUTION_SEEKING" | "RECREATIONAL_SHOPPING";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    touchpoints: {
      label:
        | "BRAND_WEBSITE"
        | "ECOMMERCE_STORE"
        | "SOCIAL_MEDIA"
        | "ONLINE_STORES";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    journey_phases: {
      label:
        | "BROWSING_FILTERING_COMPARING"
        | "EXPLORATION_LEARNING"
        | "COMMITTING_COMPLETION";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
    place_of_purchase: {
      label: "STORE" | "ONLINE";
      qualifier?: string | number | boolean;
      meta?: any;
    } | null;
  };
  relationships: {
    // Relationships informations, used to aggregate and query data to get insights, primarily for the use of specific query structures such as graph databases.
    client: string | number | null;
    retail: string | number | null;
    seller: string | number | null;
    product_sku: string | number | null;
    shelf_price: number | null;
    transaction_price: number | null;
    quantity: number | null;
    event: string[]; // A list with the id of anothers warehouse data related to this one.
  };
  date: Date; // A date that represent when this event was collected
  data: any; // The raw third-party data
}
```

## API

### About

This Backend application is a really simple, that implements a web server API with Node.JS and Express.JS, using the Typescript language. This application starts on port 3000 by default, but you can configure it editing a `.env` file.

The backend as an API listen requests on two routes, warehouse (`/`) and template (`/template`). The first manipulate `warehouse data` and the second manipulate `templates data`. You can perform the following methods:

### Methods

#### Template

The `template` methods manipulate the set of `templates`. The available methods are:

- POST (/template)

  **Description**: Insert a new template.

  **Method**: POST

  **Path**: 'localhost:3000/template'

  **Body**:

  ```typescript
  {
    "name": string,
    "labels": {
      "needs": string | null,
      "product_clusters": string | null,
      "triggers": string | null,
      "missions": string | null,
      "touchpoints": string | null,
      "journey_phases": string | null,
      "place_of_purchase": string | null
    },
    "relationships": {
      "client": string | number | null,
      "retail": string | number | null,
      "seller": string | number | null,
      "product_sku": string | number | null,
      "shelf_price": number | null,
      "transaction_price": number | null,
      "quantity": number | null
    },
  }
  ```

- GET (/template/:name)

  **Description**: Get a template by its name.

  **Method**: GET

  **Path**: 'localhost:3000/template/`{{name}}`'

  **Details**: `{{name}}` is the name field on document, usually setted on POST.

  **Body**: _There's no body in this request._

- PUT (/template/:id)

  **Description**: replace a existing template.

  **Method**: PUT

  **Path**: 'localhost:3000/template/`{{id}}`'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB

  **Body**:

  ```typescript
  {
    "name": string,
    "labels": {
      "needs": string | null,
      "product_clusters": string | null,
      "triggers": string | null,
      "missions": string | null,
      "touchpoints": string | null,
      "journey_phases": string | null,
      "place_of_purchase": string | null
    },
    "relationships": {
      "client": string | number | null,
      "retail": string | number | null,
      "seller": string | number | null,
      "product_sku": string | number | null,
      "shelf_price": number | null,
      "transaction_price": number | null,
      "quantity": number | null
    },
  }
  ```

- PATCH (/template/:id)

  **Description**: replace a field in an existing template.

  **Method**: PATCH

  **Path**: 'localhost:3000/template/`{{id}}`'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB. In the body example, we're updating only name field. You can update any `template`'s field.

  **Body**:

  ```typescript
  {
    "name": string
  }
  ```

- DELETE (/template/:id)

  **Description**: Delete a `template` by its id.

  **Method**: DELETE

  **Path**: 'localhost:3000/template/{{name}}'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB

  **Body**: _There's no body in this request._

#### Warehouse

The `Warehouse` methods manipulate the set of `warehouse`. The available methods are:

- POST (/)

  **Description**: Try to parse the data, and if it's work, insert a new `warehouse data`.

  **Method**: POST

  **Path**: 'localhost:3000?template=`{{template name}}`'

  **Details**: `{{template name}}` is the `template` name compatible with this third-party data source

  **Body**: _That can receive any body._

- GET (/:id)

  **Description**: Get a `warehouse data` by its id.

  **Method**: GET

  **Path**: 'localhost:3000/`{{id}}`'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB

  **Body**: _There's no body in this request._

- PUT (/:id)

  **Description**: replace a existing `warehouse data`.

  **Method**: PUT

  **Path**: 'localhost:3000/`{{id}}`'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB

  **Body**: _That can receive any body._

- PATCH (/:id)

  **Description**: replace a field in an existing template, or add a new field if not existing yet.

  **Method**: PATCH

  **Path**: 'localhost:3000/`{{id}}`'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB.

  **Body**: _That can receive any body._

- DELETE (/:id)

  **Description**: Delete a `warehouse data` by its id.

  **Method**: DELETE

  **Path**: 'localhost:3000/{{name}}'

  **Details**: `{{id}}` is the \_id field, setted by MongoDB

  **Body**: _There's no body in this request._

# Example

This tutorial represents a use case of this API. Please ensure that both the database and backend projects are running (see Instalation > Execute).

  1. Let's initially create a template. This template refers to the system for issuing invoices for physical stores, and will be called "iips". We know that all the information that comes from this source is about local sales and that it is in the last phase of the sale. Which makes us automatically set the information in labels.journey_phases and labels.place_of_purchase. Also, the `third-party data` has the identifier of the customer (field `client`), seller (field `seller`), store (field `store`), the item sold (field `item`), the price (field `price`) and the discount in percentage as decimal (field `percentage`). We also know that this system issues a call for each item sold, in other words, each call generates an item. Our request becomes:

  Method: `POST`

  Path: `localhost:3000/template`

  body:

  ```json
  {
    "name": "iips",
    "labels": {
      "needs": null,
      "product_clusters": null,
      "triggers": null,
      "missions": null,
      "touchpoints": null,
      "journey_phases": "COMMITTING_COMPLETION",
      "place_of_purchase": "STORE"
    },
    "relationships": {
      "client": "$client",
      "retail": "$store",
      "seller": "$seller",
      "product_sku": "$item",
      "shelf_price": "$price",
      "transaction_price": "function a(){return document.price - (document.price * document.discount)}",
      "quantity": 1,
      "events": []
    }
  }
  ```
  
  2. You can check this one perfoming: 
  
  Method: `GET`

  Path: `localhost:3000/template/iips`

  Body: *None*

  3. Now you can add a third party data from the iips source. To do this, just perform a call like the example:

  Method: `POST`

  Path: `localhost:3000?template=iips`

  Body:
  ```json
  {
    "item": "table",
    "price": 450.2,
    "discount": 0.1,
    "client": 1291,
    "seller": 89172,
    "store": "Main store 001"
  }
  ```

  4. You can view this `warehouse data` getting the data id (showed in the reponse body "insertedId" in the last function, used to add it) and make this call:

  Method: `GET`

  Path: `localhost:3000?/{{insertedId}}`

  Body: *None*

You can also test the calls via postman, by the document API.postman_collection.json available in the root of this project

# Author

<table>
  <tr>
    <td align="center"><a href="https://github.com/danilojpferreira/"><img style="border-radius: 50%;" height="100px" width="100px" src="https://media-exp1.licdn.com/dms/image/C4E03AQFgk8Q7YSODuw/profile-displayphoto-shrink_400_400/0/1586959675005?e=1651104000&v=beta&t=bGjBny0gNnvckN8Rfo9trp0vjxRQ0207kvpZzsz5nYo"><br/><p><b>Danilo Pereira</b></p></a><p>Author</p><a href="https://www.linkedin.com/in/danilojpferreira/">Linkedin</a></td>
  </tr>
  
</table>
