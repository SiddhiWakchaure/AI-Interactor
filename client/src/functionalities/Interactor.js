import React, { useState } from "react";
import axios from "axios";
import "../css/Interactor.css";
import History from "./History";

const Interactor = () => {
  const providers = ["OpenAI", "Anthropic"];

  //Popular models for each provider
  const modelOptions = {
    OpenAI: [
      "gpt-4.5-preview-2025-02-27",
      "gpt-4o-2024-08-06",
      "o1-2024-12-17",
      "o3-mini-2025-01-31",
      "gpt-4o-mini-2024-07-18",
    ],
    Anthropic: [
      "claude-3-opus-20240229",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-haiku-20240307",
    ],
  };

  //Default provider and model
  const [provider, setProvider] = useState("Anthropic");
  const [model, setModel] = useState(modelOptions["Anthropic"][0]);

  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [conversation, setConversation] = useState([]); //Array to store current session conversations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  //Fetch model for the selected(changed) provider
  const handleProviderChange = (e) => {
    const selected = e.target.value;
    setProvider(selected);
    setModel(modelOptions[selected][0]);
  };

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const updatedConversation = [
      ...conversation,
      { role: "user", content: userPrompt },
    ];

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        provider: provider.toLowerCase(),
        model,
        systemPrompt,
        userPrompt,
      });

      //Update the array only after successful response
      updatedConversation.push({ role: "model", content: res.data.result });
      setConversation(updatedConversation);

      setUserPrompt("");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  //Fetch previous conversations from Db
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/history");
      setHistory(res.data);
      setShowHistory(true);
    } catch (err) {
      setError("Unable to load history.");
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>AI Interaction Tool</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className='input-row'>
          <div className='input-group'>
            <label>Provider</label>
            <select value={provider} onChange={handleProviderChange}>
              {providers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Fetch models for the selected provider */}
          <div className='input-group'>
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {modelOptions[provider].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='input-group'>
          <label>System Prompt</label>
          <textarea
            rows={2}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>

        <div className='input-group'>
          <label>User Prompt</label>
          <textarea
            rows={5}
            required
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
        </div>

        {/* Indicate the loading state */}
        <button type='submit' disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {/* Display loader and error msg */}
      {loading && <div className='loader'></div>}
      {error && <div className='error'>{error}</div>}

      <button
        className='secondary-btn'
        onClick={fetchHistory}
        style={{ marginTop: "16px", background: "#6c757d" }}
      >
        View History
      </button>

      {/* Show currrent session conversations */}
      <div className='chat-box'>
        {conversation.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      {showHistory && (
        <History history={history} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
};

export default Interactor;
