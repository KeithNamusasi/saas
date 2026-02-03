import { supabase, showLoading, hideLoading, showToast } from './supabase-client.js';
// getUserOrRedirect if needed later

/**
 * Load all products for a user
 */
export async function getProducts(user) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading products:', error);
    throw error;
  }
  return data;
}

/**
 * Add a new product
 */
export async function addProduct(user, product) {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        user_id: user.id,
        ...product
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }
  return data;
}

/**
 * Update an existing product
 */
export async function updateProduct(user, productId, product) {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...product,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  return data;
}

/**
 * Delete a product
 */
export async function deleteProduct(user, productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * UI: Render products table
 */
export function renderProducts(products, containerId = 'productsList') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-2xl);">
        <p style="color: var(--text-muted); margin-bottom: var(--space-lg);">
          <i class="fa-solid fa-box"></i> No products yet. Add your first product to get started!
        </p>
        <button class="btn btn-primary" onclick="window.openAddProductModal()">
          <i class="fa-solid fa-plus"></i> Add Product
        </button>
      </div>
    `;
    return;
  }

  let html = `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
            <th>Stock</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;

  products.forEach(product => {
    const profit = parseFloat(product.sell_price) - parseFloat(product.buy_price);
    const profitMargin = ((profit / parseFloat(product.buy_price)) * 100).toFixed(1);

    let status = '<span class="badge badge-success">In Stock</span>';
    if (product.stock_qty === 0) {
      status = '<span class="badge badge-danger">Out of Stock</span>';
    } else if (product.stock_qty <= product.low_stock_level) {
      status = '<span class="badge badge-warning">Low Stock</span>';
    }

    html += `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>KES ${parseFloat(product.buy_price).toFixed(0)}</td>
        <td>
          KES ${parseFloat(product.sell_price).toFixed(0)}
          <br>
          <small style="color: var(--success); font-size: 0.75rem;">
            +${profitMargin}% profit
          </small>
        </td>
        <td>${product.stock_qty} units</td>
        <td>${product.low_stock_level} units</td>
        <td>${status}</td>
        <td>
          <div style="display: flex; gap: var(--space-sm);">
            <button 
              class="btn btn-secondary" 
              style="padding: 0.5rem 1rem; font-size: 0.875rem;"
              onclick='window.openEditProductModal(${JSON.stringify(product).replace(/'/g, "&apos;")})'
            >
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button 
              class="btn btn-danger" 
              style="padding: 0.5rem 1rem; font-size: 0.875rem;"
              onclick="window.handleDeleteProduct('${product.id}', '${product.name}')"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// Export to window for onclick handlers in generated HTML
window.handleDeleteProduct = async (productId, productName) => {
  if (confirm(`Are you sure you want to delete "${productName}"?`)) {
    try {
      const { getUserOrRedirect } = await import('./auth.js');
      const user = await getUserOrRedirect();
      await deleteProduct(user, productId);
      showToast('Product deleted successfully!', 'success');
      const updatedProducts = await getProducts(user);
      renderProducts(updatedProducts);
    } catch (error) {
      showToast(error.message, 'danger');
    }
  }
};

// Modal handlers
window.openAddProductModal = () => {
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').classList.remove('hidden');
};

window.openEditProductModal = (product) => {
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('buyingPrice').value = product.buy_price;
  document.getElementById('sellingPrice').value = product.sell_price;
  document.getElementById('stockQuantity').value = product.stock_qty;
  document.getElementById('lowStockThreshold').value = product.low_stock_level;
  document.getElementById('productModal').classList.remove('hidden');
};

window.closeProductModal = () => {
  document.getElementById('productModal').classList.add('hidden');
};
