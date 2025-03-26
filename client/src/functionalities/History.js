import React from "react";
import "../css/History.css";

//Backdrop to display past conversations
const History = ({ history, onClose }) => {
  return (
    <div className='modal-backdrop'>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>Past Conversations</h2>
        <div className='chat-box'>
          {/* Style the history like chat-box */}
          {history.map((conv, i) => (
            <div key={i}>
              <div className='msg user' style={{ marginBottom: "10px" }}>
                <strong>You:</strong> {conv.userPrompt}
              </div>
              <div className='msg model'>
                <strong>AI:</strong> {conv.response}
              </div>
              <hr />
            </div>
          ))}
        </div>
        <button className='close-btn' onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default History;
