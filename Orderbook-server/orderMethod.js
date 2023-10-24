const clientOrderbooksHistory = {
  samson: {
    MyOrders: [
      {
        assetId: 1,
        type: "Sell",
        quantity: 100,
        price: 10,
      },
      {
        assetId: 2,
        type: "Sell",
        quantity: 10,
        price: 10,
      },
      {
        assetId: 3,
        type: "Buy",
        quantity: 300,
        price: 10,
      },
      {
        assetId: 4,
        type: "Buy",
        quantity: 130,
        price: 10,
      },
      {
        assetId: 5,
        type: "Buy",
        quantity: 150,
        price: 10,
      }
    ],
    OtherOrders: [],
  }
};

const SubmitOrder = (clientId, order) => {
  CreateClientOrderbooks(clientId, order);
  return "successful";
};

const CreateClientOrderbooks = (clientId, order) => {
  // Create client instance in the orders book history if it does not exist
  if (!clientOrderbooksHistory[clientId]) {
    clientOrderbooksHistory[clientId] = {
      MyOrders: [],
      OtherOrders: [],
    };
  }

  // Add the order to the client's orderbook instance
  clientOrderbooksHistory[clientId].MyOrders.push(order);

  DistributeOrderToAll(clientId, order);
  MatcheOrders(clientId, order);
};

const DistributeOrderToAll = (clientId, order) => {
  Object.keys(clientOrderbooksHistory).forEach((otherClient) => {
    if (otherClient !== clientId) {
      clientOrderbooksHistory[otherClient]["OtherOrders"].push(order);
    }
  });
};

const MatcheOrders = (clientId, order) => {
  let matchedClientId = "";
  let matchingOrder = null;

  for (const otherClient in clientOrderbooksHistory) {
    if (otherClient !== clientId) {
      const existingOrders = clientOrderbooksHistory[otherClient];
      matchingOrder = existingOrders["MyOrders"].find((res) => {
        return (
          res.assetId === order.assetId &&
          res.type !== order.type &&
          res.price === order.price
        );
      });

      if (matchingOrder) {
        matchedClientId = otherClient;
        break;
      }
    }
  }

  if (matchingOrder) {
    TransactionBetweenMatchedOrder(matchedClientId, order, matchingOrder);
  }
};

const TransactionBetweenMatchedOrder = (
  matchedClientId,
  order,
  matchingOrder
) => {
  const remainQuantity = matchingOrder.quantity - order.quantity;
  UpdateClientOrderbooksHistory(matchedClientId, matchingOrder, remainQuantity);
};

const UpdateClientOrderbooksHistory = (
  matchedClientId,
  matchingOrder,
  remainingQuantity
) => {
  const myOrders = clientOrderbooksHistory[matchedClientId]["MyOrders"];

  const matchingOrderIndex = myOrders.findIndex(
    (order) => order.assetId === matchingOrder.assetId
  );

  if (matchingOrderIndex !== -1) {
    myOrders[matchingOrderIndex].quantity = remainingQuantity;
  }
};

module.exports.SubmitOrder = SubmitOrder;
