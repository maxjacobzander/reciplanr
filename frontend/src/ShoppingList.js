function ShoppingList({ shoppingList }) {
  if (shoppingList.length) {
    return (
      <div className="shoppingList" style={{ backgroundColor: "white" }}>
        <h2 style={{ textAlign: "center" }}>Your Shopping List</h2>
        <ul style={{ listStyleType: "none" }}>
          {shoppingList.map((item, index) => (
            <li key={index}>
              <input type="checkbox" />
              {/* React can't render objects as children, so I need render indiviudal fields here */}
              {item.quantity} {item.unit} {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ShoppingList;
