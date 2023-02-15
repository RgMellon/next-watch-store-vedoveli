import { useFetchProducts } from '../hooks/use-fetch-products';
import ProductCard from '../components/product-card';
import Search from '../components/search';
import { useState } from 'react';
import { useCartStore } from '../store/cart';

export default function Home() {
  const { error, products } = useFetchProducts();
  const [term, setTerm] = useState('');

  const addToCart = useCartStore((store) => store.actions.add);

  // estados derivados
  const filtredProduct =
    term.length > 0
      ? products.filter(
          ({ title }) => title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1,
        )
      : products;

  const renderProductQuantity = () => {
    return filtredProduct.length === 1 ? '1 Product' : `${products.length} Products`;
  };

  return (
    <main className="my-8" data-testid="product-list">
      <Search
        doSearch={(term) => {
          setTerm(term);
        }}
      />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">{renderProductQuantity()}</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {!error && products.length === 0 && <h4 data-testid="no-products">No Products</h4>}
          {error && <h4 data-testid="server-error">Server is down</h4>}

          {filtredProduct.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </main>
  );
}
