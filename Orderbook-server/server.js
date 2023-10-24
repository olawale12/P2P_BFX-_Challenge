"use strict";

const { PeerRPCServer } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const _ = require("lodash");
const SubmitOrderMethod = require("./orderMethod");

const link = new Link({
  grape: "http://127.0.0.1:30001",
});
link.start();

const peer = new PeerRPCServer(link, {});
peer.init();

const service = peer.transport("server");
//service.listen(1337)
service.listen(_.random(1000) + 1024);

setInterval(() => {
  link.announce("orderbooks_worker", service.port, {});
}, 1000);

service.on("request", (rid, key, payload, handler) => {
  const { clientId, order } = payload;
  const result = SubmitOrderMethod.SubmitOrder(clientId, order);
  handler.reply(null, result);
});
