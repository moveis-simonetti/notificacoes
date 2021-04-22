import PushNotifications from "@pusher/push-notifications-server";

const beamsClient =
  process.env.PUSHER_INSTANCE_ID &&
  process.env.PUSHER_SECRET_KEY &&
  new PushNotifications({
    instanceId: process.env.PUSHER_INSTANCE_ID,
    secretKey: process.env.PUSHER_SECRET_KEY,
  });

export function sendNotification(login, { notificacao }) {
  const { assunto, conteudo, url_destino } = notificacao;

  let notification = {
    title: assunto,
    body: conteudo,
  };

  if (url_destino) notification.deep_link = url_destino;

  beamsClient &&
    beamsClient
      .publishToUsers([login], {
        web: { notification },
      })
      .then((publishResponse) =>
        console.log("Just published:", publishResponse.publishId)
      )
      .catch((error) => console.error("Error:", error));
}

export default beamsClient;
