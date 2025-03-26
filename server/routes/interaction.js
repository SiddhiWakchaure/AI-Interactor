const express = require("express");
const router = express.Router();
const config = require("config");

//SDKs
const { OpenAI } = require("openai");
const anthropic = require("@anthropic-ai/sdk");

//Model
const Interaction = require("../models/interaction");

//Route to interact with an approproate AI model
//Get the keys from config/default.json
router.post("/chat", async (req, res) => {
  const { provider, model, systemPrompt, userPrompt } = req.body;

  try {
    let response;

    if (provider === "openai") {
      const openai = new OpenAI({ apiKey: config.get("OpenAI_Key") });

      response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const chat = new Interaction({
        ...req.body,
        response: response.choices[0].message.content,
      });
      await chat.save();

      res.json({ result: response.choices[0].message.content }); //return a new json with the result only
    } else if (provider === "anthropic") {
      const anthropicClient = new anthropic.Anthropic({
        apiKey: config.get("Anthropic_Key"),
      });

      response = await anthropicClient.messages.create({
        model,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 1000,
      });

      const chat = new Interaction({
        ...req.body,
        response: response.content[0].text,
      });

      await chat.save();
      res.json({ result: response.content[0].text }); //return a new json with the result only
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Route to fetch the previous conversations from Db
router.get("/history", async (req, res) => {
  try {
    const interactions = await Interaction.find();
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

module.exports = router;
