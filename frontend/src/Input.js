import { useState } from "react";

// destructure props
function InputIngredients({ type, label, setShoppingList, placeholder }) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    // preventDefault() to prevent reload on SPA
    e.preventDefault();
    console.log("form submitted");
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = `${backendUrl}${
      type === "link" ? "/ingredients-from-link" : "/ingredients"
    }`;
    const payload =
      type === "link" ? { url: inputValue } : { text: inputValue };
    // console.log(url);
    try {
      console.log("Sending data:", payload);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setShoppingList((prevList) => [...prevList, ...data.shoppingList]);
      setInputValue("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding ingredients:", error);
      setErrorMessage(
        "Oops! Something went wrong. Please enter the ingredients manually or try a different website."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={`input-${type}`}>{label}</label>
      <br />
      {type === "link" ? (
        <input
          id={`input-${type}`}
          className="inputField"
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          placeholder={placeholder}
        />
      ) : (
        <textarea
          id={`input-${type}`}
          className="inputField"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          placeholder={placeholder}
          rows={6}
        />
      )}
      <br />
      <button type="submit">Submit</button>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </form>
  );
}

export default InputIngredients;
