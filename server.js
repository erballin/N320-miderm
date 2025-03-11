const http = require("http");
const fs = require("fs");
const path = require("path");

const WebFile = require("./functions/webfile");

/**
 *
 * @param {http.ClientRequest} req
 * @param {http.ServerResponse} res
 */
function app(req, res) {
  const fileReq = new WebFile(req.url);
  const filePath = path.join(__dirname, "views/", fileReq.filename);

  const contentType =
    fs.existsSync(filePath) && fileReq.getExtension() ? fileReq.getMimeType() : "text/html";

  let filePathToUse = "";

  if (fs.existsSync(filePath) && fileReq.getExtension()) {
    filePathToUse = filePath;
  } else if (!fileReq.getExtension() && fs.existsSync(path.join(filePath, "index.html"))) {
    filePathToUse = path.join(filePath, "index.html");
    // if (fs.existsSync(checkHtml)) filePathToUse = checkHtml;
  } else {
    filePathToUse = path.join(__dirname, "view/404.html");
    res.writeHead(404, { "content-type": "text/html" });
    res.write(fs.readFileSync(path.join(__dirname, "views/404.html")));
    res.end();
    return;
  }

  res.writeHead(200, { "Content-Type": contentType });
  res.write(fs.readFileSync(filePathToUse));
  res.end();
}

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Server live at http://127.0.0.1:${port}`);
