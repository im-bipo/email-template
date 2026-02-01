import express from "express";
import { booking, form, woocommerce, siteDataMap } from "./data/data.js";
import { sendMail } from "./mail.js";

const app = express();
const PORT = 3000;
// Set EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const id = req.query.id ?? "25b6fd4a-9ae5-474e-983f-817bd2573616";
  const siteData = siteDataMap[id];
  if (!siteData) {
    return res.status(404).send("Site data not found");
  }
  const siteType = siteData?.site?.siteType?.toLowerCase();
  console.log("siteType", siteType);

  switch (siteType) {
    case "woocommerce":
      return res.render(`woocommerce`, { siteData, woocommerce });
    case "general":
      return res.render(`general`, { siteData, form });
    case "salon":
      if (false) {
        sendMail("salon", id, { booking })
          .then((info) => {
            console.log("Email sent:", info.messageId || info.response || info);
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      }
      return res.render(`salon`, { siteData, booking });
    default:
      return res.status(400).send("Unknown site type");
  }

  //   res.render("general", { id });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
