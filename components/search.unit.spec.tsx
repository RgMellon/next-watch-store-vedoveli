import Search from './search';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const doSearch = jest.fn();
describe('<Search />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render a form', async () => {
    const { getByTestId, getByRole } = render(<Search doSearch={doSearch} />);
    const form = getByRole('form', { name: 'search-form' });

    expect(form).toBeInTheDocument();
  });

  it('Should call props.doSearch when form is submitted', async () => {
    const { getByRole } = render(<Search doSearch={doSearch} />);
    const form = getByRole('form', { name: 'search-form' });
    await fireEvent.submit(form);
    expect(doSearch).toHaveBeenCalledTimes(1);
  });

  it('should render a input type equals search', () => {
    const { getByRole } = render(<Search doSearch={doSearch} />);
    const input = getByRole('textbox', { name: 'text-search' });
    expect(input).toHaveProperty('type', 'search');
  });

  it('Should call props.doSearch with the user input', async () => {
    const { getByRole } = render(<Search doSearch={doSearch} />);

    const inputText = 'some text here';
    const form = getByRole('form', { name: 'search-form' });
    const input = getByRole('textbox', { name: 'text-search' });

    await userEvent.type(input, inputText);

    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(inputText);
  });

  it('Should call doSearch when search input is cleared', async () => {
    const { getByRole } = render(<Search doSearch={doSearch} />);

    const inputText = 'some text here';
    const input = getByRole('textbox', { name: 'text-search' });

    await userEvent.type(input, inputText);
    await userEvent.clear(input);

    expect(doSearch).toHaveBeenCalledTimes(1);
    expect(doSearch).toHaveBeenCalledWith('');
  });
});
