import React from "react";

export default function InitialModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Hey There!</h2>
        <p>
          Since this app is currently hosted on a free infrastructure, it may
          take up to 1 minute to wake up after you click "Submit" for the first
          time.
          <br /> <br />
          Thanks for your patience!
        </p>
        <button onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
