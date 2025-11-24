import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../components/ProductForm';
import type { Product } from '../types';

const categories = ['ELECTRONICS', 'FASHION'] as const;

function renderCreate(onSave = jest.fn()) {
  render(React.createElement(ProductForm, { mode: 'create', categories: categories as any, initial: null, onSave, onCancel: () => { } }));
  return onSave;
}
function renderEdit(initial: Product, onSave = jest.fn()) {
  render(React.createElement(ProductForm, { mode: 'edit', categories: categories as any, initial, onSave, onCancel: () => { } }));
  return onSave;
}

it('TC1: render đủ fields', () => {
  renderCreate();
  ['product-name', 'product-price', 'product-quantity', 'product-description', 'product-category', 'submit-button']
    .forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument());
});

it('TC2: nhập dữ liệu name & price', () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Laptop Dell' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '15000000' } });
  expect((screen.getByTestId('product-name') as HTMLInputElement).value).toBe('Laptop Dell');
  expect((screen.getByTestId('product-price') as HTMLInputElement).value).toBe('15000000');
});

it('TC3: submit hợp lệ gọi onSave với payload', async () => {
  const onSave = renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Laptop Dell' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '15000000' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '10' } });
  fireEvent.change(screen.getByTestId('product-category'), { target: { value: 'FASHION' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
  expect(onSave.mock.calls[0][0]).toEqual({ name: 'Laptop Dell', price: 15000000, quantity: 10, description: '', category: 'FASHION' });
});

it('TC4: submit rỗng hiển thị lỗi và không gọi onSave', () => {
  const onSave = renderCreate();
  fireEvent.click(screen.getByTestId('submit-button'));
  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByTestId('error-name')).toHaveTextContent('Name phải từ 3–100');
});

it('TC5: lỗi đồng thời name & price', async () => {
  renderCreate();
  const nameEl = screen.getByTestId('product-name');
  const priceEl = screen.getByTestId('product-price');
  fireEvent.change(nameEl, { target: { value: 'AB' } });
  fireEvent.change(priceEl, { target: { value: '-1000' } });
  // Blur cả hai để đánh dấu touched trước submit
  fireEvent.blur(nameEl);
  fireEvent.blur(priceEl);
  fireEvent.click(screen.getByTestId('submit-button'));
  // Chờ cả hai lỗi xuất hiện (tránh race render)
  await screen.findByTestId('error-name');
  await screen.findByTestId('error-price');
  expect(screen.getByTestId('error-name')).toBeInTheDocument();
  expect(screen.getByTestId('error-price')).toBeInTheDocument();
});

// Extra coverage
it('TC7: category missing hiển thị lỗi category', async () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
  fireEvent.change(screen.getByTestId('product-category'), { target: { value: '' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await screen.findByTestId('error-category');
  expect(screen.getByTestId('error-category')).toHaveTextContent('Category bắt buộc');
});

it('TC8: description quá dài hiển thị lỗi description', async () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
  fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'X'.repeat(501) } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await screen.findByTestId('error-description');
  expect(screen.getByTestId('error-description')).toHaveTextContent(/500 ký tự/);
});

it('TC9: quantity quá lớn hiển thị lỗi quantity', async () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '100000' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await screen.findByTestId('error-quantity');
  expect(screen.getByTestId('error-quantity')).toHaveTextContent(/99,999/);
});

it('TC10: cancel button gọi onCancel', () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  render(React.createElement(ProductForm, { mode: 'create', categories: categories as any, initial: null, onSave, onCancel }));
  fireEvent.click(screen.getByRole('button', { name: 'Huỷ' }));
  expect(onCancel).toHaveBeenCalled();
});

it('TC6: edit mode prefill dữ liệu', () => {
  const initial: Product = { id: 1, name: 'Laptop Dell', price: 15000000, quantity: 10, description: 'XPS 13', category: 'FASHION' };
  renderEdit(initial);
  expect((screen.getByTestId('product-name') as HTMLInputElement).value).toBe('Laptop Dell');
  expect((screen.getByTestId('product-price') as HTMLInputElement).value).toBe('15000000');
  expect((screen.getByTestId('product-quantity') as HTMLInputElement).value).toBe('10');
  expect((screen.getByTestId('product-description') as HTMLTextAreaElement).value).toBe('XPS 13');
  expect((screen.getByTestId('product-category') as HTMLSelectElement).value).toBe('FASHION');
});

// TC11: tên quá dài >100
it('TC11: name >100 ký tự báo lỗi', async () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'X'.repeat(101) } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await screen.findByTestId('error-name');
  expect(screen.getByTestId('error-name')).toHaveTextContent('Name phải từ 3–100');
});
// TC12: price quá lớn > 999,999,999
it('TC12: price >999,999,999 báo lỗi', async () => {
  renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000000000' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await screen.findByTestId('error-price');
  expect(screen.getByTestId('error-price')).toHaveTextContent('Price > 0');
});
// TC13: quantity âm
it('TC13: quantity âm báo lỗi', async () => {
  renderCreate();
  const qtyEl = screen.getByTestId('product-quantity');
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.change(qtyEl, { target: { value: '-1' } });
  fireEvent.blur(qtyEl); // đảm bảo touched
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(screen.getByTestId('error-quantity')).toBeInTheDocument());
  expect(screen.getByTestId('error-quantity')).toHaveTextContent('Quantity');
});
// TC14: summary-errors không xuất hiện khi không submit invalid
it('TC14: summary absent ban đầu và sau valid submit', async () => {
  renderCreate();
  expect(screen.queryByTestId('summary-errors')).toBeNull();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(screen.queryByTestId('summary-errors')).toBeNull());
});

// TC15: boundary hợp lệ price=1, quantity=0
it('TC15: boundary hợp lệ price=1, quantity=0 không lỗi', async () => {
  const onSave = renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Edge Item' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '0' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(onSave).toHaveBeenCalled());
  expect(screen.queryByTestId('error-price')).toBeNull();
  expect(screen.queryByTestId('error-quantity')).toBeNull();
});

// TC16: boundary quantity max 99,999
it('TC16: quantity=99999 hợp lệ', async () => {
  const onSave = renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'MaxQty' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '10' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '99999' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(onSave).toHaveBeenCalled());
  expect(screen.queryByTestId('error-quantity')).toBeNull();
});

// TC17: boundary price max 999,999,999
it('TC17: price=999999999 hợp lệ', async () => {
  const onSave = renderCreate();
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'MaxPrice' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: '999999999' } });
  fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
  fireEvent.click(screen.getByTestId('submit-button'));
  await waitFor(() => expect(onSave).toHaveBeenCalled());
  expect(screen.queryByTestId('error-price')).toBeNull();
});
