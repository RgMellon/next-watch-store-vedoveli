import { useEffect, useState } from 'react';
import { ProdctItem } from '../components/product-card';
import axios from 'axios';

export const useFetchProducts = () => {
  const [products, setProducts] = useState<ProdctItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get('/api/products/')
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(true));
  }, []);

  return {
    products,
    error,
  };
};
