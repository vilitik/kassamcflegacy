const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

router.post("/:product_code",function (req,res,next) {
    const mcfInfo = req.body.mcfInfo;
    if (!mcfInfo) return res.sendStatus(401);
  
    fetch(
    `${mcfInfo.addr}/v1/stock/${req.params.product_code}`,
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