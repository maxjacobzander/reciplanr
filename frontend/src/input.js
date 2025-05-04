import { useState } from "react";

// destructure props
function InputIngredients({ type, label, setShoppingList, placeholder }) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    // preventDefault() to prevent reload on SPA
    e.preventDefault();
    const url = type === "link" ? "/ingredients-from-link" : "/ingredients";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error with status: ${response.status}`);
      }

      const data = await response.json();
      setShoppingList(data.shoppingList);
      setInputValue("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding ingredients:", error);
      setErrorMessage("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={`input-${type}`}>{label}</label>
      <input
        id={`input-${type}`}
        type={type === "link" ? "url" : "text"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
        placeholder={placeholder}
      />
      <button type="submit">Submit</button>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </form>
  );
}

export default InputIngredients;
