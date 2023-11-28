const express = require("express");
const app = express();

const jsonServer = require("json-server");
const jsonServerMiddleware = jsonServer.router("database/db.json");

const fs = require("fs");

const port = 5000;

app.use("/api", jsonServerMiddleware);

app.get("/produtos", (req, res) => {
  const produtos = JSON.parse(fs.readFileSync("database/db.json")).produtos;
  res.send(produtos);
});

app.get("/produtos/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const produtos = JSON.parse(fs.readFileSync("database/db.json")).produtos;
  const produto = produtos.find((produto) => produto.id === id);

  if (produto) {
    res.send(produto);
  } else {
    res.status(404);
    res.send("Produto não encontrado");
  }
});

app.post("/produtos", express.json(), (req, res, next) => {
  const produtos = JSON.parse(fs.readFileSync("database/db.json")).produtos;
  let newId = 1;

  if (!!produtos.length) {
    newId = produtos.at(-1).id + 1;
  }

  const newProduct = {
    id: newId,
    ...req.body,
  };

  produtos.push(newProduct);

  fs.writeFileSync("database/db.json", JSON.stringify({ produtos }));

  res.send(newProduct);
});

app.put("/produtos/:id", express.json(), (req, res, next) => {
  const produtos = JSON.parse(fs.readFileSync("database/db.json")).produtos;

  const id = parseInt(req.params.id);

  const produto = produtos.find((produto) => produto.id === id);

  if (produto) {
    const produtoEditado = {
      id,
      ...req.body,
    };

    let produtosEditados = [];

    produtos.forEach((produto) => {
      if (produto.id === id) {
        produto = produtoEditado;
      }
      produtosEditados.push(produto);
    });

    fs.writeFileSync(
      "database/db.json",
      JSON.stringify({ produtos: produtosEditados })
    );

    res.send("Produto editado com Sucesso");
  } else {
    res.status(404);
    res.send("Produto não encontrado");
  }
});

app.delete("/produtos/:id", (req, res, next) => {
  const produtos = JSON.parse(fs.readFileSync("database/db.json")).produtos;

  const id = parseInt(req.params.id);

  const produto = produtos.find((produto) => produto.id === id);
  if (produto) {
    const produtosEditados = produtos.filter((produto) => produto.id !== id);

    fs.writeFileSync(
      "database/db.json",
      JSON.stringify({ produtos: produtosEditados })
    );

    res.send("Produto excluído com Sucesso");
  } else {
    res.status(404);
    res.send("Produto não encontrado");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
