import { renderHook, act, RenderResult } from '@testing-library/react-hooks';
import { BearState, useCartStore } from '.';
import { makeServer } from '../../miragejs/server';
import { AnyRegistry } from 'miragejs/-types';
import { Server } from 'miragejs';

describe('Cart Store', () => {
  let server = {} as Server<AnyRegistry>;
  let result = {} as RenderResult<BearState>;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
  });

  afterEach(() => {
    server.shutdown();
    act(() => result.current.actions.reset());
  });

  it('Should return open equals false on initial state', async () => {
    expect(result.current.state.open).toBeFalsy();
  });

  it('Should toggle open state', async () => {
    const toggle = result.current.actions.toggle;

    act(() => {
      toggle();
    });

    expect(result.current.state.open).toBeTruthy();
    expect(result.current.state.products).toHaveLength(0);

    act(() => {
      toggle();
    });

    expect(result.current.state.open).toBeFalsy();
    expect(result.current.state.products).toHaveLength(0);
  });

  it('Should return an empty array for products on initial state', () => {
    expect(result.current.state.products).toHaveLength(0);
    expect(Array.isArray(result.current.state.products)).toBeTruthy();
  });

  it('Should add 2 products to the list and open the cart', () => {
    const products = server.createList('product', 2);
    const add = result.current.actions.add;

    for (const product of products) {
      act(() => {
        add(product);
      });
    }

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.open).toBeTruthy();
  });

  it('should not add same product twice', () => {
    const product = server.create('product');
    const add = result.current.actions.add;

    act(() => add(product));
    act(() => add(product));

    expect(result.current.state.products).toHaveLength(1);
  });

  it('Should remove a product from the store', () => {
    const [product, product2] = server.createList('product', 2);
    const add = result.current.actions.add;
    const remove = result.current.actions.remove;

    act(() => {
      add(product);
      add(product2);
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      remove(product);
    });

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0]).toEqual(product2);
  });

  it('Should not change products in the cart if provided product is not in the array', () => {
    const [product, product2, product3] = server.createList('product', 3);
    const add = result.current.actions.add;
    const remove = result.current.actions.remove;

    act(() => {
      add(product);
      add(product2);
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      remove(product3);
    });

    expect(result.current.state.products).toHaveLength(2);
  });

  it('should assign 1 as initial quantity on product add()', () => {
    const product = server.create('product');
    const add = result.current.actions.add;

    act(() => {
      add(product);
    });

    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should increase quantity', () => {
    const product = server.create('product');
    const add = result.current.actions.add;
    const increase = result.current.actions.increase;

    act(() => {
      add(product);
      increase(product);
    });

    expect(result.current.state.products[0].quantity).toBe(2);
  });

  it('should decrease quantity', () => {
    const product = server.create('product');
    const add = result.current.actions.add;
    const decrease = result.current.actions.decrease;
    const increase = result.current.actions.increase;

    act(() => {
      add(product);
      increase(product);
      decrease(product);
    });

    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should NOT decrease bellow zero', () => {
    const product = server.create('product');
    const add = result.current.actions.add;
    const decrease = result.current.actions.decrease;

    act(() => {
      add(product);
      decrease(product);
      decrease(product);
    });

    expect(result.current.state.products[0].quantity).toBe(0);
  });

  it('Should remove all products from the store', () => {
    const [product, product2] = server.createList('product', 2);
    const add = result.current.actions.add;
    const removeAll = result.current.actions.removeAll;

    act(() => {
      add(product);
      add(product2);
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      removeAll();
    });

    expect(result.current.state.products).toHaveLength(0);
  });
});
