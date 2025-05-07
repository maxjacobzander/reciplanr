function ShoppingList({ shoppingList }) {
  if (shoppingList.length) {
    return (
      <div>
        <h2>Your Shopping List</h2>
        <ul>
          {shoppingList.map((item, index) => (
            <ui key={index}>
              <input type="checkbox" />
              {/* React can't render objects as children, so I need render indiviudal fields here */}
              {item.quantity} {item.unit} {item.name}
            </ui>
          ))}
        </ul>
      </div>
    );
  }
}

export default ShoppingList;
