import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders: React.FC<any> = props => {
    return props.children;
};

const customRender = (ui: React.ReactElement, options: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };