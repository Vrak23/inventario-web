import React, { useState } from 'react';
import { Search, Plus, Trash2, ShoppingCart, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function ModuloVentas({ products, onUpdateStock }) {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientName, setClientName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProducts = products.filter(p =>
    p.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.includes(searchTerm)
  );

  const handleAddToCart = (product) => {
    const inCart = cart.find(item => item.codigo === product.codigo);
    if (inCart) {
      if (inCart.cantidad >= Number(product.stock)) {
        setErrorMsg('Stock insuficiente para agregar más unidades.');
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      setCart(cart.map(item =>
        item.codigo === product.codigo ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      if (Number(product.stock) === 0) {
        setErrorMsg(`"${product.producto}" no tiene stock disponible.`);
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const handleChangeCantidad = (codigo, value) => {
    const product = products.find(p => p.codigo === codigo);
    const val = Math.max(1, Math.min(Number(value), Number(product.stock)));
    setCart(cart.map(item =>
      item.codigo === codigo ? { ...item, cantidad: val } : item
    ));
  };

  const handleRemoveFromCart = (codigo) => {
    setCart(cart.filter(item => item.codigo !== codigo));
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleConfirmSale = () => {
    if (cart.length === 0) return;
    cart.forEach(item => {
      onUpdateStock(item.codigo, Number(item.stock) - item.cantidad);
    });
    setSuccessMsg(`Venta registrada por S/ ${total.toFixed(2)} ✓`);
    setCart([]);
    setClientName('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="ventas-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Registro de Ventas</span>
          <h1 className="gradient-text">Nueva Venta</h1>
        </div>
        <button className="btn-primary" onClick={() => { setIsModalOpen(true); setSearchTerm(''); setErrorMsg(''); }}>
          <Plus size={18} /> Agregar Productos
        </button>
      </div>

      {successMsg && (
        <div className="ventas-alert-success">
          <CheckCircle size={18} /><span>{successMsg}</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <label className="form-label">Cliente (opcional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="Nombre del cliente o 'Consumidor Final'"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={{ maxWidth: 400, marginTop: '0.5rem' }}
        />
      </div>

      <div className="glass-card ventas-table-card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th style={{ textAlign: 'center' }}>Cantidad</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
                <th style={{ textAlign: 'center' }}>Quitar</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <ShoppingCart size={32} style={{ opacity: 0.3 }} />
                      <span>Sin productos. Presiona "Agregar Productos".</span>
                    </div>
                  </td>
                </tr>
              ) : (
                cart.map(item => (
                  <tr key={item.codigo}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{item.producto}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{item.codigo}</div>
                    </td>
                    <td>S/ {Number(item.precio).toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.cantidad}
                        onChange={(e) => handleChangeCantidad(item.codigo, e.target.value)}
                        className="form-input ventas-qty-input"
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="ventas-btn-delete" onClick={() => handleRemoveFromCart(item.codigo)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {cart.length > 0 && (
          <div className="ventas-cart-footer">
            <div className="ventas-total">
              Total: <span>S/ {total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" onClick={handleConfirmSale}>
              <CheckCircle size={18} /> Confirmar Venta
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 620 }}>
            <button className="ventas-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.25rem', color: 'white' }}>Buscar Producto</h2>

            {errorMsg && (
              <div className="login-error-badge" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} /><span>{errorMsg}</span>
              </div>
            )}

            <div className="ventas-search-box">
              <Search size={18} className="ventas-search-icon" />
              <input
                autoFocus
                type="text"
                className="form-input"
                placeholder="Buscar por nombre o código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>

            <div className="ventas-product-list">
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  No se encontraron productos.
                </div>
              ) : (
                filteredProducts.map(p => {
                  const inCart = cart.find(c => c.codigo === p.codigo);
                  const sinStock = Number(p.stock) === 0;
                  return (
                    <div key={p.codigo} className={`ventas-product-row ${sinStock ? 'ventas-row-disabled' : ''}`}>
                      <div className="ventas-product-info">
                        <div style={{ fontWeight: 600, color: sinStock ? '#64748b' : 'white' }}>{p.producto}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {p.codigo} · {p.categoria} · Stock: {p.stock}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>S/ {Number(p.precio).toFixed(2)}</span>
                        <button
                          className="ventas-btn-add"
                          onClick={() => handleAddToCart(p)}
                          disabled={sinStock}
                          title={sinStock ? 'Sin stock' : 'Agregar al carrito'}
                          style={{ opacity: sinStock ? 0.4 : 1 }}
                        >
                          <Plus size={16} />
                        </button>
                        {inCart && (
                          <span className="badge badge-success" style={{ minWidth: 28, textAlign: 'center' }}>
                            {inCart.cantidad}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setIsModalOpen(false)}>
                Listo ({cart.length} producto{cart.length !== 1 ? 's' : ''})
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ventas-view { display: flex; flex-direction: column; gap: 1.5rem; }
        .ventas-table-card { padding: 0 !important; overflow: hidden; }
        .ventas-alert-success {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.9rem 1.25rem;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 12px; color: #4ade80; font-weight: 500;
        }
        .ventas-cart-footer {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 1.5rem; padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .ventas-total { font-size: 1.1rem; color: #94a3b8; font-weight: 500; }
        .ventas-total span { color: white; font-size: 1.4rem; font-weight: 800; margin-left: 0.5rem; }
        .ventas-qty-input { width: 70px !important; text-align: center; padding: 0.4rem !important; }
        .ventas-btn-delete {
          padding: 0.5rem; border-radius: 8px; border: none; cursor: pointer;
          background: rgba(239,68,68,0.1); color: #f87171;
          border: 1px solid rgba(239,68,68,0.2); transition: all 0.2s;
        }
        .ventas-btn-delete:hover { background: #ef4444; color: white; }
        .ventas-btn-add {
          padding: 0.5rem; border-radius: 8px; border: none; cursor: pointer;
          background: rgba(56,189,248,0.1); color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.2); transition: all 0.2s;
        }
        .ventas-btn-add:hover:not(:disabled) { background: #38bdf8; color: white; }
        .ventas-modal-close {
          position: absolute; right: 1.5rem; top: 1.5rem;
          background: none; border: none; color: #64748b; cursor: pointer;
        }
        .ventas-modal-close:hover { color: white; }
        .ventas-search-box { position: relative; width: 100%; margin-bottom: 1.25rem; }
        .ventas-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; }
        .ventas-product-list {
          display: flex; flex-direction: column; gap: 0.5rem;
          max-height: 380px; overflow-y: auto; padding-right: 0.25rem;
        }
        .ventas-product-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1rem; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07); transition: background 0.2s;
        }
        .ventas-product-row:hover:not(.ventas-row-disabled) {
          background: rgba(56,189,248,0.07);
          border-color: rgba(56,189,248,0.2);
        }
        .ventas-row-disabled { opacity: 0.5; cursor: not-allowed; }
        .ventas-product-info { display: flex; flex-direction: column; gap: 0.2rem; }
      `}</style>
    </div>
  );
}