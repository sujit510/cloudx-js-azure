import { productsContainer, stocksContainer } from "./db";
import { products } from "./const";

Promise.all(products.map(async (product) => {
  await productsContainer.items.upsert({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
  });
  await stocksContainer.items.upsert({
    product_id: product.id,
    count: product.count,
  });
})).then(() => {
  console.log('Seed data added successfully!')
}).catch((err) => {
  console.log('Error while adding Seed data::', err)
});

