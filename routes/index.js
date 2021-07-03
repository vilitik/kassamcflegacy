const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/products", function (req, res, next) {
  console.log("------");
  console.log(req.body);
  const mcfInfo = req.body.mcfInfo;
  if (!mcfInfo) return res.sendStatus(401);

  fetch(
    `${mcfInfo.addr}/v1/products?expand=stock_item,variations,variations.stock_item`,
    {
      headers: {
        Accept: "*/*",
        Authorization:
          "Basic " +
          Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString("base64")
      }
    }
  ).then((resp) => {
    if (resp.status !== 200) return res.sendStatus(501);

    resp.json().then((data) => {
      res.status(200).json(data.data);
    });
  });

  //res.sendStatus(500);
});

module.exports = router;