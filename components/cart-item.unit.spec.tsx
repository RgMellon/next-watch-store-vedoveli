import CartItem from './cart-item';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { useCartStore } from '../store/cart';
import { renderHook } from '@testing-library/react-hooks';
import { setAutoFreeze } from 'immer';

setAutoFreeze(false);

const product = {
  title: 'Relógio bonito',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

function renderCartItem() {
  return render(<CartItem product={product} />);
}

describe('<CartItem />', () => {
  it('Should render CartItem', async () => {
    const { getByTestId } = renderCartItem();

    expect(getByTestId('cart-item')).toBeInTheDocument();
  });

  it('Should display proper content', async () => {
    const { getByTestId, getByText } = renderCartItem();

    const image = getByTestId('image');

    expect(getByText(product.title)).toBeInTheDocument();
    expect(getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();

    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  });

  it('should call remove() when button is clicked', async () => {
    const result = renderHook(() => useCartStore()).result;
    const spy = jest.spyOn(result.current.actions, 'remove');

    const { getByRole } = renderCartItem();

    const removeButton = getByRole('button', { name: /remove/i });

    fireEvent.click(removeButton);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('should call increase when increase button is clicked', async () => {
    const result = renderHook(() => useCartStore()).result;
    const spy = jest.spyOn(result.current.actions, 'increase');

    const { getByRole } = renderCartItem();
    const increaseButton = getByRole('button', { name: /increase-button/i });
    fireEvent.click(increaseButton);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('should call increase when increase button is clicked', async () => {
    const result = renderHook(() => useCartStore()).result;
    const spy = jest.spyOn(result.current.actions, 'decrease');

    const { getByRole } = renderCartItem();
    const decreaseButton = getByRole('button', { name: /decrease-button/i });
    fireEvent.click(decreaseButton);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
});
