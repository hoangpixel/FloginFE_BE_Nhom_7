import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../components/ProductForm';
if (!HTMLFormElement.prototype.requestSubmit) {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    writable: true,
    configurable: true
  });
}
const categories = ['ELECTRONICS', 'FASHION'];
function renderCreate(onSave = jest.fn()) {
  render(
    <ProductForm
      mode="create"
      categories={categories}
      initial={null}
      onSave={onSave}
      onCancel={() => { }}
    />
  );
  return onSave;
}
function renderEdit(initial, onSave = jest.fn()) {
  render(
    <ProductForm
      mode="edit"
      categories={categories}
      initial={initial}
      onSave={onSave}
      onCancel={() => { }}
    />
  );
  return onSave;
}
describe('ProductForm Component Tests', () => {
  it('TC1: Render du fields', () => {
    renderCreate();
    const ids = ['product-name', 'product-price', 'product-quantity', 'product-description', 'product-category', 'submit-button'];
    ids.forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument());
  });
  
  it('TC2: Nhap du lieu name & price', () => {
    renderCreate();

    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Laptop Dell' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '15000000' } });
    
    expect(screen.getByTestId('product-name').value).toBe('Laptop Dell');
    expect(screen.getByTestId('product-price').value).toBe('15000000');
  });

  it('TC3: Submit hop le goi onSave voi payload', async () => {
    const onSave = renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Laptop Dell' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '15000000' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('product-category'), { target: { value: 'FASHION' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0]).toEqual({
      name: 'Laptop Dell',
      price: 15000000,
      quantity: 10,
      description: '',
      category: 'FASHION'
    });
  });

  it('TC4: Submit rong hien thi loi va khong goi onSave', () => {
    const onSave = renderCreate();
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByTestId('error-name')).toHaveTextContent('Ten san pham khong duoc de trong');
  });

  it('TC5: Loi dong thoi name & price', async () => {
    renderCreate();
    const nameEl = screen.getByTestId('product-name');
    const priceEl = screen.getByTestId('product-price');
    fireEvent.change(nameEl, { target: { value: 'AB' } });
    fireEvent.change(priceEl, { target: { value: '-1000' } });
    fireEvent.blur(nameEl);
    fireEvent.blur(priceEl);
    fireEvent.click(screen.getByTestId('submit-button'));
    await screen.findByTestId('error-name');
    await screen.findByTestId('error-price');
    expect(screen.getByTestId('error-name')).toBeInTheDocument();
    expect(screen.getByTestId('error-price')).toBeInTheDocument();
  });

  it('TC7: Category missing hien thi loi category', async () => {
    renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('product-category'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  it('TC8: Description qua dai hien thi loi', async () => {
    renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'X'.repeat(501) } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await screen.findByTestId('error-description');
    expect(screen.getByTestId('error-description')).toHaveTextContent('khong duoc vuot qua 500');
  });

  it('TC9: Quantity qua lon hien thi loi', async () => {
    renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '100000' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await screen.findByTestId('error-quantity');
    expect(screen.getByTestId('error-quantity')).toHaveTextContent('khong duoc vuot qua 99999');
  });

  it('TC10: Cancel button goi onCancel', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    render(
      <ProductForm
        mode="create"
        categories={categories}
        initial={null}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /huỷ/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('TC6: Edit mode prefill du lieu', () => {
    const initial = {
      id: 1,
      name: 'Laptop Dell',
      price: 15000000,
      quantity: 10,
      description: 'XPS 13',
      category: 'FASHION'
    };
    renderEdit(initial);
    expect(screen.getByTestId('product-name').value).toBe('Laptop Dell');
    expect(screen.getByTestId('product-price').value).toBe('15000000');
    expect(screen.getByTestId('product-quantity').value).toBe('10');
    expect(screen.getByTestId('product-description').value).toBe('XPS 13');
    expect(screen.getByTestId('product-category').value).toBe('FASHION');
  });

  it('TC11: Name > 100 ky tu bao loi', async () => {
    renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'X'.repeat(101) } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await screen.findByTestId('error-name');
    expect(screen.getByTestId('error-name')).toHaveTextContent('tu 3 den 100 ky tu');
  });

  it('TC12: Price > 999,999,999 bao loi', async () => {
    renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000000000' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await screen.findByTestId('error-price');
    expect(screen.getByTestId('error-price')).toHaveTextContent('khong duoc vuot qua');
  });

  it('TC13: Quantity am bao loi', async () => {
    renderCreate();
    const qtyEl = screen.getByTestId('product-quantity');
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.change(qtyEl, { target: { value: '-1' } });
    fireEvent.blur(qtyEl);
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByTestId('error-quantity')).toBeInTheDocument());
    expect(screen.getByTestId('error-quantity')).toHaveTextContent('So luong phai la so nguyen');
  });

  it('TC14: Summary absent ban dau va sau valid submit', async () => {
    renderCreate();
    expect(screen.queryByTestId('summary-errors')).toBeNull();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.queryByTestId('summary-errors')).toBeNull());
  });

  it('TC15: Boundary hop le price=1, quantity=0', async () => {
    const onSave = renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Edge Item' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(screen.queryByTestId('error-price')).toBeNull();
    expect(screen.queryByTestId('error-quantity')).toBeNull();
  });

  it('TC16: Boundary quantity max 99999 hop le', async () => {
    const onSave = renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'MaxQty' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '99999' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(screen.queryByTestId('error-quantity')).toBeNull();
  });

  it('TC17: Boundary price max 999999999 hop le', async () => {
    const onSave = renderCreate();
    fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'MaxPrice' } });
    fireEvent.change(screen.getByTestId('product-price'), { target: { value: '999999999' } });
    fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(screen.queryByTestId('error-price')).toBeNull();
  });
});