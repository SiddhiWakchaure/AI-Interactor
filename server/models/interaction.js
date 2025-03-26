const mongoose = require("mongoose");

//Model to save the previous conversations
const interactionSchema = new mongoose.Schema({
  provider: {
    type: String,
  },
  model: {
    type: String,
  },
  systemPrompt: {
    type: String,
  },
  userPrompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  timestamp: { type: Date, default: Date.now },
});

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;
