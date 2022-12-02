const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi"); // you can use the Yup package

const app = express();

app.get("/", (req, res) => {
  res.send("welcome home");
});
const products = [
  {
    id: "1",
    name: "Orange",
    price: "25",
  },
  {
    id: "2",
    name: "Lemon",
    price: "30",
  },
  {
    id: "3",
    name: "Carrot",
    price: "35",
  },
];

app.get("/api/products", (req, res) => {
  res.send(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((b) => b.id === req.params.id);
  if (!product) {
    return res.status(404).send([]);
  }
  return res.send(product);
});

app.post("/api/products/", (req, res) => {
  const { error } = validation(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: req.body.price,
  };

  products.push(product);

  req.status(200).send({ message: product });
});

app.put("/api/products/:id", (req, res) => {
  const { error } = validation(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  // find and update
  const index = products.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    // id not found
    return res.status(404).json({
      message: "Product not found this the id",
    });
  }
  // update the record
  products[index].name = req.body.name;
  products[index].price = req.body.price;

  return res.status(200).json({
    product: products[index],
  });
});

const validation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(3).required(),
    price: Joi.number().required(),
  });

  return schema.validate(body);
};

// uppdate using the patch method
app.patch("/api/products/:id", (req, res) => {
  // find and update
  const index = products.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    // id not found
    return res.status(404).json({
      message: "Product not found this the id",
    });
  }

  let updateProduct = { ...products[index], ...req.body }; // spread the req.body will overwrite the field that match in products[index]
  products[index] = updateProduct;
  return res.status(200).json(updateProduct);
  //updatedProduct will be {name:'orange', price:'200', price:'500' }
});

app.delete("/api/products/:id", (req, res) => {
  // find and update
  const product = products.find((b) => b.id === req.params.id);
  if (!product) {
    // id not found
    return res.status(404).json({
      message: "Product not found this the id",
    });
  }
  const index = products.findIndex((b) => b.id === req.params.id);
  products.splice(index, 1);
  return res.status(200).json({
    message: "Product successfully deleted",
  });
});

app.delete("/api/products", (req, res) => {
  products.splice(0);
  return res.status(200).json(products);
});

// define port
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
