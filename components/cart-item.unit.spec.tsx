import CartItem from './cart-item';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { debug } from 'util';

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

  it('should display 1 as initial quantity', () => {
    const { getByTestId } = renderCartItem();

    const quantity = getByTestId('quantity');

    expect(quantity.textContent).toBe('1');
  });

  it('should increase quantity by 1 when second button is clicked', async () => {
    const { getAllByRole, getByTestId } = renderCartItem();
    const [_, button] = getAllByRole('button');

    await fireEvent.click(button);
    expect(getByTestId('quantity').textContent).toBe('2');
  });

  it('should decrease quantity by 1 when second button is clicked', async () => {
    const { getAllByRole, getByTestId } = renderCartItem();
    const [buttonDecrease, buttonIncrease] = getAllByRole('button');

    const quantity = getByTestId('quantity');

    await fireEvent.click(buttonIncrease);

    await fireEvent.click(buttonDecrease);

    expect(quantity.textContent).toBe('1');
  });

  it('should not go bellow zero in the quantity', () => {
    const { getAllByRole, getByTestId } = renderCartItem();
    const [buttonDecrease] = getAllByRole('button');

    const quantity = getByTestId('quantity');

    fireEvent.click(buttonDecrease);
    fireEvent.click(buttonDecrease);

    expect(quantity.textContent).toBe('0');
  });
});
