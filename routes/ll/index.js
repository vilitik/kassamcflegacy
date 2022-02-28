const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

router.post("/:search",function (req,res,next) {
    const mcfInfo = req.body.mcfInfo;
    let body = {}
    let method = 'GET'
    if (!mcfInfo) return res.sendStatus(401);
    if(req.body.doChanges && req.body.quantity) {
        body.quantity = req.body.quantity
        method = 'PATCH'
        body = JSON.stringify(body)
    } else {
        body = null
    }
  
    fetch(
    `${mcfInfo.addr}/v1/customers`,
        {
            method,
            headers: {
                Accept: "*/*",
                Authorization:
                "Basic " +
                Buffer.from(`${mcfInfo.user}:${mcfInfo.password}`).toString("base64")
            },
            body
        }
    ).then((resp) => {
      if (resp.status !== 200) return res.sendStatus(501);
  
      resp.json().then((data) => {
        res.status(200).json(data.data.filter(customer => `${customer.firstname} ${customer.lastname} ${customer.email}`.includes(req.params.search)));
      });
    });
})

module.exports = router