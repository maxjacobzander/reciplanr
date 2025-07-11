export default async function clearShoppingList(setShoppingList) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  await fetch(`${backendUrl}/clear-list`, {
    method: "POST",
    credentials: "include",
  });
  setShoppingList([]);
}
