const { Bill, Item, Participant } = require("../models");
const imagekit = require("../helpers/imagekit");
const openai = require("../helpers/openAi");

class BillController {
  //!! UPLOAD IMAGE
  static async uploadBillImage(req, res, next) {
    try {
      if (!req.file) {
        return next({
          name: "BadRequest",
          message: "No file uploaded",
        });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      // upload imageKit
      const photoResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "/bill-uploads",
      });
      /*{
    "message": "File uploaded successfully",
    "imageUrl": "https://ik.imagekit.io/bezitoz/bill-uploads/food2_Nj3QHcA6b.jpg"
    }*/

      // buat kalo storing billIDnya
      // const userId = req.user.id;
      // let updatedBill = await Bill.update(
      //   { billImageUrl: response.url },
      //   { where: { id: BillId, createdBy: userId } }
      // );

      //OPENAI
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are provided with a photo of a restaurant bill. 
Return a strictly valid JSON object *without any line breaks*, code blocks, or extra commentary. 
The JSON should have this structure exactly:
{"items":[{"name":"string","quantity":number,"price":number}],
"vatAmount":number,"serviceChargeAmt":number,"totalPayment":number}

- Convert prices to integers (no commas).
- Service is noted as SERVICE, usually at 10% of the SUBTOTAL.
- If there's no service charge, set "serviceChargeAmt": 0.
- VAT is noted as VAT or PB1, usually at 11% of the SUBTOTAL.
- If there's no vat, set "vatAmount": 0.
- If there's no total payment, set "totalPayment" = sum of all item prices.
- Do NOT wrap your response in triple backticks or add new lines.

Attached image:
`,
              },

              {
                type: "image_url",
                image_url: {
                  url: photoResponse.url,
                },
              },
            ],
          },
        ],
        store: true,
      });

      console.log(gptResponse.choices[0]);

      const rawOutput = gptResponse.choices[0].message.content;
      const cleanedOutput = rawOutput.replace(/(\r\n|\n|\r)/gm, "").trim();

      let parsedJson;
      try {
        parsedJson = JSON.parse(cleanedOutput);
      } catch (error) {
        return next({
          name: "BadRequest",
          message: "Output is not valid JSON",
        });
      }

      //OPENAI

      return res.status(200).json({
        message: "File uploaded successfully",
        imageUrl: photoResponse.url,
        // message: response.choices[0],
        rawGPT: rawOutput,
        data: parsedJson,
      });
    } catch (err) {
      next(err);
    }
  }

  //!! UPLOAD IMAGE

  static async createBill(req, res, next) {
    try {
      const userId = req.user.id;
      const { billImageUrl, vatAmount, serviceChargeAmt } = req.body;

      const parsedVatAmount = isNaN(parseInt(vatAmount))
        ? 0
        : parseInt(vatAmount);
      const parsedServiceChargeAmt = isNaN(parseInt(serviceChargeAmt))
        ? 0
        : parseInt(serviceChargeAmt);

      if (isNaN(parsedVatAmount) || isNaN(parsedServiceChargeAmt)) {
        next({
          name: "BadRequest",
          message: "VAT rate and service charge must be valid numbers",
        });
        return;
      }
      //   console.log(parsedVatRate, parsedServiceChargeRate);
      const newBill = await Bill.create({
        createdBy: userId,
        billImageUrl,
        vatAmount: parsedVatAmount,
        serviceChargeAmt: parsedServiceChargeAmt,
      });
      return res
        .status(201)
        .json({ message: "Bill created successfully", bill: newBill });
    } catch (err) {
      next(err);
    }
  }

  static async getBillsByUser(req, res, next) {
    try {
      //   return res.json("logging for getBillsByUser");
      // const { userId } = req.params;

      //authorization terpisah
      const authenticatedUserId = req.user.id;

      const bills = await Bill.findAll({
        where: { createdBy: authenticatedUserId },
        include: [
          {
            model: Item,
            include: [
              {
                model: Participant,
                through: { attributes: [] },
              },
            ],
          },
          {
            model: Participant,
          },
        ],
      });

      return res.status(200).json({ bills });
    } catch (err) {
      next(err);
    }
  }

  static async getBillById(req, res, next) {
    try {
      //   return res.json("logging for getBillById");
      const { id } = req.params;
      const bill = await Bill.findByPk(id, {
        include: [
          {
            model: Item,
            include: [
              {
                model: Participant,
                through: { attributes: [] },
              },
            ],
          },
          {
            model: Participant,
          },
        ],
      });

      if (!bill) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ bill });
    } catch (err) {
      next(err);
    }
  }

  static async updateBill(req, res, next) {
    try {
      //   return res.json("logging for updateBill");
      const { id } = req.params;
      const { billImageUrl, vatAmount, serviceChargeAmt } = req.body;

      const [updated] = await Bill.update(
        { billImageUrl, vatAmount, serviceChargeAmt },
        { where: { id } }
      );

      if (!updated) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ message: "Bill updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBill(req, res, next) {
    try {
      //   return res.json("logging for deleteBill");
      const { id } = req.params;
      const deleted = await Bill.destroy({ where: { id } });

      if (!deleted) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ message: "Bill deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BillController;
