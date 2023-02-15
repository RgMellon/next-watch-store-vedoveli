import '@testing-library/jest-dom';
import { makeServer } from '../miragejs/server';
import { fireEvent, render, renderHook } from '@testing-library/react';
import Cart from './cart';
import { useCartStore } from '../store/cart';
import { act as hooksAct } from '@testing-library/react-hooks';
import { setAutoFreeze } from 'immer';
import userEvent from '@testing-library/user-event';

function makeSut() {
  return render(<Cart />);
}

setAutoFreeze(false);
describe('<Cart />', () => {
  let server;
  let result;
  let spy;
  let add;
  let toggle;
  let reset;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    toggle = result.current.actions.toggle;
    add = result.current.actions.add;
    spy = jest.spyOn(result.current.actions, 'toggle');
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('Should add css class "hidden" in the component', async () => {
    const { getByTestId } = makeSut();

    expect(getByTestId('cart')).toHaveClass('hidden');
  });

  it('Should remove css class "hidden" in the component when toggle is clicked', async () => {
    const { getByTestId } = makeSut();

    await fireEvent.click(getByTestId('close-button'));

    expect(getByTestId('cart')).not.toHaveClass('hidden');
  });

  fit('Should call toggle fn when button close is clicked', async () => {
    const { getByTestId } = makeSut();

    const button = getByTestId('close-button');

    await userEvent.click(button);
    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('Should display 2 products cards', () => {
    const { getAllByTestId } = makeSut();
    const products = server.createList('product', 2);

    hooksAct(() => {
      for (const product of products) {
        add(product);
      }
    });

    expect(getAllByTestId('cart-item')).toHaveLength(2);
  });

  it('should remove all products when clear button is clicked', async () => {
    const products = server.createList('product', 2);

    hooksAct(() => {
      for (const product of products) {
        add(product);
      }
    });

    const { getAllByTestId, getByRole, queryAllByTestId } = makeSut();
    expect(getAllByTestId('cart-item')).toHaveLength(2);

    const button = getByRole('button', { name: /clear cart/ });

    fireEvent.click(button);

    expect(queryAllByTestId('cart-item')).toHaveLength(0);
  });

  it('Should not display clear cart button if no products are in the cart', async () => {
    const { queryByRole } = makeSut();

    const button = queryByRole('button', { name: /clear cart/ });
    expect(button).not.toBeInTheDocument();
  });
});
