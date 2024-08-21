const fs = require("fs");
const http = require("http");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
const { URL } = require("url");
const myURL = new URL(`http://localhost:8080${req.url}`);
const { pathname, searchParams } = myURL;

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const { pathname, searchParams } = url;

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    console.log(cardsHTML);
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const productId = searchParams.get("id");
    const product = dataObj[productId];

    const output = replaceTemplate(templateProduct, product);

    res.end(output);
  }
  // API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
