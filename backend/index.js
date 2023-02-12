const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.get("/contacts", async (req, res) => {
  const contacts = await prisma.contacts.findMany();
  res.json(contacts);
});

app.post("/contacts", async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
  const newContact = await prisma.contacts.create({
    data: { firstName, lastName, phoneNumber },
  });
  res.json(newContact);
});

app.put("/contacts/:id", async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
  const contact = await prisma.contacts.update({
    where: { id: Number(req.params.id) },
    data: { firstName, lastName, phoneNumber },
  });
  res.json(contact);
});

app.delete("/contacts/:id", async (req, res) => {
  const contact = await prisma.contacts.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(contact);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
