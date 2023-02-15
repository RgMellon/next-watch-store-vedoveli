import { create } from 'zustand';
import { ProdctItem } from '../../components/product-card';
import produce from 'immer';

export interface BearState {
  state: {
    open: boolean;
    products: ProdctItem[];
  };
  actions: {
    reset: () => void;
    toggle: () => void;
    remove: (product: ProdctItem) => void;
    add: (product: ProdctItem) => void;
    removeAll: () => void;
    increase: (product: ProdctItem) => void;
    decrease: (product: ProdctItem) => void;
  };
}

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create<BearState>((set) => {
  const setState = (fn) => set(produce(fn));

  return {
    state: { ...initialState },
    actions: {
      toggle() {
        setState(({ state }: BearState) => {
          state.open = !state.open;
        });
      },
      add(product) {
        setState(({ state }: BearState) => {
          const doesntExist = !state.products.find(({ id }) => id === product.id);

          if (doesntExist) {
            if (!product.quantity) {
              product.quantity = 1;
            }
            state.products.push(product);
            state.open = true;
          }
        });
      },
      increase(product) {
        setState(({ state }: BearState) => {
          const localProduct = state.products.find(({ id }) => id === product.id);

          if (localProduct) {
            localProduct.quantity++;
          }
        });
      },
      decrease(product) {
        setState(({ state }: BearState) => {
          const localProduct = state.products.find(({ id }) => id === product.id);

          if (localProduct && localProduct.quantity > 0) {
            localProduct.quantity--;
          }
        });
      },
      remove(product) {
        setState(({ state }: BearState) => {
          const exists = !!state.products.find(({ id }) => id === product.id);

          if (exists) {
            state.products = state.products.filter(({ id }) => {
              return id !== product.id;
            });
          }
        });
      },
      removeAll() {
        setState(({ state }: BearState) => {
          state.products = [];
        });
      },
      reset() {
        setState((store: BearState) => {
          store.state = initialState;
        });
      },
    },
  };
});
