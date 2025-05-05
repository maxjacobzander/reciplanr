function ShoppingList({ shoppingList }) {
  return (
    <div>
      <h2>Your Shopping List</h2>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>
            <input type="checkbox" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
