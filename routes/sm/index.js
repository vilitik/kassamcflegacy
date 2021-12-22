const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

router.get("/:product_id/:variation_id",function (req,res,next) {
    const mcfInfo = req.body.mcfInfo;
    if (!mcfInfo) return res.sendStatus(401);

    let faddr =  `${mcfInfo.addr}/v1/products/${req.params.product_id}`
    if(req.params.variation_id != 0) faddr += `/variations/${req.params.variation_id}`
    faddr += '?expand=stock_item'
  
    fetch(
      faddr,
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
})

module.exports = router