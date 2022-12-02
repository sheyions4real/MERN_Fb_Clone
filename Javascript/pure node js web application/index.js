const http = require("http");
const url = require("url"); // to process request url
const fs = require("fs").promises;
const bicycles = require("./data/data.json");
//console.log(bicycles);

const server = http.createServer(async (req, res) => {
  console.log("Server is running now");
  console.log(req.url);
  if (req.url === "/favicon.ico") return;

  const myUrl = new URL(req.url, `http://${req.headers.host}/`); // dynamic host name // "http://localhost:3000/"); // url and the base url to return the url object with all details
  const pathname = myUrl.pathname;
  const id = myUrl.searchParams.get("id");

  if (pathname === "/") {
    let html = await fs.readFile("./view/bicycles.html", "utf-8");

    const card = await fs.readFile("./view/main/bmain.html", "utf-8");

    let allBicycles = "";
    for (let index = 0; index <= bicycles.length - 1; index++) {
      allBicycles += replaceTemplate(card, bicycles[index]);
    }
    html = html.replace(/<%AllMainBicycle%>/g, allBicycles);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html); // render a html page
  } else if (pathname === "/bicycle" && id >= 0 && id <= 5) {
    let html = await fs.readFile("./view/overview.html", "utf-8");

    // get the bicycles details by the id
    const bicycle = bicycles.find((b) => b.id === id);
    //console.log(bicycle);
    html = replaceTemplate(html, bicycle);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else if (/\.(png)$/i.test(req.url)) {
    const image = await fs.readFile(`./public/image/${req.url.slice(1)}`);
    res.writeHead(200, { "Content-Type": "image/html" });
    res.end(image);
  } else if (/\.(css)$/i.test(req.url)) {
    const css = await fs.readFile(`./public/css/index.css`);
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(css);
  } else if (/\.(svg)$/i.test(req.url)) {
    const svg = await fs.readFile(`./public/image/icons.svg`);
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(svg);
  } else {
    // bad route
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<div><h1>File Not found</h1></div>");
  }
});

server.listen("3000");

function replaceTemplate(html, bicycle) {
  html = html.replace(/<%IMAGE%>/g, bicycle.image);
  html = html.replace(/<%NAME%>/g, bicycle.name);
  html = html.replace(/<%ID%>/g, bicycle.id);
  html = html.replace(/<%ORIGINALPRICE%>/g, `$${bicycle.originalPrice}`);

  let price = bicycle.originalPrice;
  if (bicycle.hasDiscount) {
    price = (price * (100 - bicycle.discount)) / 100;
  }
  if (bicycle.hasDiscount) {
    html = html.replace(
      /<%DISCOUNT%>/g,
      `<div class="discount__rate"><p> ${bicycle.discount}% Off</p></div>`
    );
  } else {
    html = html.replace(/<%DISCOUNT%>/g, ``);
  }

  html = html.replace(/<%NEWPRICE%>/g, `$${price}.00`);

  for (let index = 0; index < bicycle.star; index++) {
    //console.log(index);
    html = html.replace(/<%STAR%>/, `checked`);
  }
  html = html.replace(/<%STAR%>/, ``);

  return html;
}
