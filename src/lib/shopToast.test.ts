import { shopAddedMessage } from './shopToast';

describe('shopAddedMessage', () => {
  it('names the ingredient that landed in Shop', () => {
    expect(shopAddedMessage('Pasta')).toBe('Pasta added to Shop');
    expect(shopAddedMessage('Mozzarella')).toBe('Mozzarella added to Shop');
  });
});
