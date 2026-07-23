import React from "react";

function LikedPanel({ likedItems, onSelect, onUnlike }) {
  return (
    <aside className="cart-panel">
      <div className="cart-panel-header">
        <h3>Liked</h3>
        <div>{likedItems.length} items</div>
      </div>
      <div className="cart-items">
        {likedItems.length ? (
          likedItems.map((item) => (
            <div key={item.id} className="panel-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', textAlign: 'left', flex: 1 }} onClick={() => onSelect(item)}>
                <span>{item.title}</span>
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="todo-btn" onClick={() => onSelect(item)}>View</button>
                <button className="todo-btn danger" onClick={() => onUnlike(item.id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <div className="panel-empty">You have no liked items</div>
        )}
      </div>
    </aside>
  );
}

export default LikedPanel;
