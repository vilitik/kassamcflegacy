const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Error" });
});

router.post("/products", function (req, res, next) {
  console.log("------");
  console.log(req.body);
  const mcfInfo = req.body.mcfInfo;
  if (!mcfInfo) return res.sendStatus(401);

  fetch(
    `${mcfInfo.addr}/v1/products?expand=image_links,stock_item,variations,variations.stock_item&page_size=999999`,
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

router.post("/campaigns", function (req, res, next) {
  console.log("------");
  console.log(req.body);
  const mcfInfo = req.body.mcfInfo;
  if (!mcfInfo) return res.sendStatus(401);

  fetch(`${mcfInfo.addr}/v0/campaigns?expand=prices&page_size=999999`, {
    headers: {
      Accept: "*/*",
      Authorization:
        "Basic " +
        Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString("base64")
    }
  }).then((resp) => {
    if (resp.status !== 200) return res.sendStatus(501);

    resp.json().then((data) => {
      res.status(200).json(data.data);
    });
  });

  //res.sendStatus(500);
});

router.post("/newLegacyOrderBookkeeping", async function (req, res, next) {
  console.log("------");
  console.log(req.body);
  const mcfInfo = req.body.mcfInfo;
  const payload = req.body.payload;
  if (!mcfInfo || !payload) return res.sendStatus(401);
  console.log(JSON.stringify(payload));

  fetch(`${mcfInfo.addr}/v0/orders`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization:
        "Basic " +
        Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString("base64")
    },
    body: JSON.stringify(payload)
  }).then((resp) => {
    console.log(resp.status);
    //if (resp.state !== 201) return res.sendStatus(503);

    resp.json().then((data) => {
      console.log(data);

      const fulldatar = await fetch(
        `${mcfInfo.addr}/v0/orders/${data.data.id}?expand=tax_summary`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization:
              "Basic " +
              Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString(
                "base64"
              )
          }
        }
      )
      const fulldata = await fulldatar.json()

      res.status(200).json({...data, pwrk_tax_summary: fulldata.tax_summary });

      fetch(
        `${mcfInfo.addr}/v0/orders/${data.data.id}/payments/${data.data.payments[0].id}/mark-as-paid`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization:
              "Basic " +
              Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString(
                "base64"
              )
          }
        }
      ).then(() => {
        fetch(`${mcfInfo.addr}/v0/orders/${data.data.id}/quick-process`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization:
              "Basic " +
              Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString(
                "base64"
              )
          }
        });
      });
    });
  });

  //res.sendStatus(500);
});

module.exports = router;
