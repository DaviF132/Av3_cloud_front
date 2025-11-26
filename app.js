const productList = document.querySelector('#products');

// Add form
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');

// Update form fields
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');
const searchForm = document.querySelector('#search-form');
const searchIdInput = document.querySelector('#search-id');
const searchResult = document.querySelector('#search-result');


// ===========================
// Fetch all products
// ===========================
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${product.name}</strong> - $${product.price}<br>
      <em>${product.description}</em>
    `;

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Update Button
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductDescription.value = product.description;
      updateProductPrice.value = product.price;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}


// ===========================
// Add Product
// ===========================
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = addProductForm.elements['name'].value;
  const description = addProductForm.elements['description'].value;
  const price = addProductForm.elements['price'].value;

  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, description, price) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });

  return response.json();
}


// ===========================
// Update Product
// ===========================
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;

  await updateProduct(id, name, description, price);
  updateProductForm.reset();
  await fetchProducts();
});

async function updateProduct(id, name, description, price) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });

  return response.json();
}


// ===========================
// Delete Product
// ===========================
async function deleteProduct(id) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  return response.json();
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = searchIdInput.value;

  const response = await fetch(`http://localhost:3000/products/${id}`);
  const data = await response.json();

  if (!data || data.length === 0) {
    searchResult.innerHTML = `<p><strong>Product not found.</strong></p>`;
    return;
  }

  const product = data[0];

  searchResult.innerHTML = `
    <h3>Product Found:</h3>
    <p><strong>ID:</strong> ${product.id}</p>
    <p><strong>Name:</strong> ${product.name}</p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Price:</strong> $${product.price}</p>
  `;
});


// Load products on start
fetchProducts();