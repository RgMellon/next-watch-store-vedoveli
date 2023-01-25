import ProductCard from './product-card';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const product = {
  title: 'Relógio bonito',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

const addToCart = jest.fn();

function renderProductCard() {
  return render(<ProductCard product={product} addToCart={addToCart} />);
}

describe('<ProductCard />', () => {
  it('Should render ProductCard', async () => {
    const { getByTestId } = renderProductCard();

    expect(getByTestId('product-card')).toBeInTheDocument();
  });

  it('Should display proper content', async () => {
    const { getByTestId, getByText } = renderProductCard();

    expect(getByText(product.title)).toBeInTheDocument();
    expect(getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(getByTestId('image')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('Should call props.addToCart when button is clicked', async () => {
    const { getByRole } = renderProductCard();

    const button = getByRole('button', { name: 'product-card-button' });

    fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
