"use strict";

const { PeerRPCClient } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");

const link = new Link({
  grape: "http://127.0.0.1:30001",
  requestTimeout: 10000,
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const payload = {
  clientId: "366478597784-hujnfndjnf-5379484647848",
  order: {
    assetId: 1,
    type: "Buy",
    quantity: 10,
    price: 10,
  },
};


peer.request("orderbooks_worker", payload, { timeout: 100000 }, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
