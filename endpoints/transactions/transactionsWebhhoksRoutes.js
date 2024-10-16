const { Webhook } = require("fedapay");
const router = require("express").Router({ mergeParams: true });
require("dotenv").config();

const ENDPOINT_SECRET = process.env.FEDA_PAY_WEBHOOK_SECRET;

router.route("/webhook").post((req, res) => {
  const sig = req.headers["x-fedapay-signature"];

  let event;

  try {
    event = Webhook.constructEvent(request.body, sig, ENDPOINT_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.name) {
    case 'transaction.created':
      // Transaction créée
      break;
    case 'transaction.approved':
      // Transaction approuvée
      break;
    case 'transaction.canceled':
      // Transaction annulée
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(req.body);
  console.log(event);

  // Assurez-vous que l'événement est une transaction réussie
  // if (event && event.event_type === "transaction.success") {
  //   const transactionId = event.transaction.id;
  //   const status = event.transaction.status;

  //   if (status === "approved") {
  //     // Traitez le paiement ici (mise à jour de la base de données, confirmation à l'utilisateur, etc.)
  //     console.log(`Transaction ${transactionId} réussie from /webhook`);
  //   }
  // }

  res.status(200).send({
    event,
    body: req.body
  });
});

module.exports = router;
