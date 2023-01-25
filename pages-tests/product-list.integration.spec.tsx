import ProductList from '../pages';
import '@testing-library/jest-dom';
import { makeServer } from '../miragejs/server';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Response } from 'miragejs';
import userEvent from '@testing-library/user-event';

function makeSut() {
  return render(<ProductList />);
}

describe('<ProductList />', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Should render ProductList', async () => {
    const { getByTestId } = makeSut();

    expect(getByTestId('product-list')).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    server.createList('product', 10);

    const { getAllByTestId } = makeSut();

    await waitFor(() => {
      expect(getAllByTestId('product-card')).toHaveLength(10);
    });
  });

  it('should render the "no products message"', async () => {
    const { getByTestId } = makeSut();

    await waitFor(() => {
      expect(getByTestId('no-products')).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.createList('product', 10);

    server.get('products', () => {
      return new Response(500, {}, '');
    });

    const { getByTestId, queryByTestId, queryAllByTestId } = makeSut();

    await waitFor(() => {
      expect(getByTestId('server-error')).toBeInTheDocument();
      expect(queryByTestId('product-card')).toBeNull();
      expect(queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  fit('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio bonito';

    server.createList('product', 2);

    server.create('product', {
      title: searchTerm,
    });

    const { getAllByTestId, getByRole } = makeSut();

    await waitFor(() => {
      expect(getAllByTestId('product-card')).toHaveLength(3);
    });

    const form = getByRole('form');
    const input = getByRole('textbox', { name: 'text-search' });

    await userEvent.type(input, searchTerm);
    fireEvent.submit(form);

    await waitFor(() => {
      expect(getAllByTestId('product-card')).toHaveLength(1);
    });
  });
});
