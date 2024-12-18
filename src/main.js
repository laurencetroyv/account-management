import { Client, Users, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  log("Setting up Appwrite Client")
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);
  const databases = new Databases(client)

  try {
    log("Fetching response body")
    const data = JSON.parse(req.body)
    log(`Request Body: ${req.body}`)

    log(`Reponse path ${data["route"]}`)
    if (data["route"] === "update") {

      const id = data['id']
      const firstname = data['firstname']
      const lastname = data['lastname']
      const email = data['email']
      const phone = data['phone']
      const password = data['password']

      const name = `${firstname} ${lastname}`

      const user = await users.get(id)

      log(`Name`)
      if (name !== user.name) {
        await users.updateName(id, name);
      }

      log(`Phone`)
      if (phone !== user.phone) {
        await users.updatePhone(id, phone);
      }

      log(`Email`)
      if (email !== user.email)
        await users.updateEmail(id, email);

      log(`Password}`)
      if (password.length !== 0) {
        await users.updatePassword(id, password);
      }

      log(`Update Database`)
      databases.updateDocument(
        "673b418100295c788a93",
        "673b41c1003840fb1cd8",
        id,
        {
          firstname,
          lastname,
          phonenumber: phone,
          email,
        }
      )
      log(`Done`)
    } else if (data["route"] === "delete") {
      const id = data['id']

      await users.delete(id)

      await databases.deleteDocument(
        "673b418100295c788a93",
        "673b41c1003840fb1cd8",
        id,
      )
    }

    return res.json({
      data: "Completed!"
    })
  } catch (err) {
    return error.log({
      message: err.toString()
    })
  }
};
