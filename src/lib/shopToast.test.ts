import { shopAddedInlineLabel, shopAddedMessage } from './shopToast';

describe('shopAddedMessage', () => {
  it('names the ingredient that landed in Shop', () => {
    expect(shopAddedMessage('Pasta')).toBe('Pasta added to Shop');
    expect(shopAddedMessage('Mozzarella')).toBe('Mozzarella added to Shop');
  });

  it('keeps the inline chip short beside the ingredient', () => {
    expect(shopAddedInlineLabel()).toBe('Added to Shop');
  });
});
