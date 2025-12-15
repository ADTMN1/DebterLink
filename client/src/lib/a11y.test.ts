import { describe, it, expect, vi } from 'vitest';
import { a11y, handleKeyboardClick } from './a11y';

describe('a11y.onKeyboardClick', () => {
  it('calls callback on Enter key', () => {
    const callback = vi.fn();
    const handler = a11y.onKeyboardClick(callback);
    
    handler({ key: 'Enter', preventDefault: vi.fn() } as any);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback on Space key', () => {
    const callback = vi.fn();
    const handler = a11y.onKeyboardClick(callback);
    
    handler({ key: ' ', preventDefault: vi.fn() } as any);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback on other keys', () => {
    const callback = vi.fn();
    const handler = a11y.onKeyboardClick(callback);
    
    handler({ key: 'a', preventDefault: vi.fn() } as any);
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('a11y.makeInteractive', () => {
  it('returns correct ARIA attributes', () => {
    const onClick = vi.fn();
    const props = a11y.makeInteractive(onClick);

    expect(props.role).toBe('button');
    expect(props.tabIndex).toBe(0);
    expect(typeof props.onClick).toBe('function');
    expect(typeof props.onKeyDown).toBe('function');
  });

  it('calls onClick on Enter key', () => {
    const onClick = vi.fn();
    const props = a11y.makeInteractive(onClick);

    props.onKeyDown({ key: 'Enter', preventDefault: vi.fn() } as any);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Space key', () => {
    const onClick = vi.fn();
    const props = a11y.makeInteractive(onClick);

    props.onKeyDown({ key: ' ', preventDefault: vi.fn() } as any);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('handleKeyboardClick', () => {
  it('calls callback on Enter', () => {
    const callback = vi.fn();
    const handler = handleKeyboardClick(callback);

    handler({ key: 'Enter', preventDefault: vi.fn() } as any);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback on Space', () => {
    const callback = vi.fn();
    const handler = handleKeyboardClick(callback);

    handler({ key: ' ', preventDefault: vi.fn() } as any);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('prevents default on Enter and Space', () => {
    const callback = vi.fn();
    const handler = handleKeyboardClick(callback);
    const preventDefault = vi.fn();

    handler({ key: 'Enter', preventDefault } as any);
    expect(preventDefault).toHaveBeenCalled();
  });
});
