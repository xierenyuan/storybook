import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { VisionSimulator, baseList } from './VisionSimulator';

const getOptionByNameAndPercentage = (option: string, percentage: number) =>
  screen.getByText(
    (content, element) =>
      content !== '' &&
      element.textContent === option &&
      (percentage === undefined || element.nextSibling.textContent === `${percentage}% of users`)
  );

function ThemedVisionSimulator() {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <VisionSimulator />
    </ThemeProvider>
  );
}

describe('Vision Simulator', () => {
  it('should render tool button', async () => {
    // when
    render(<ThemedVisionSimulator />);

    // then
    // waitFor because WithTooltip is a lazy component
    await waitFor(() => expect(screen.getByTitle('Vision simulator')).toBeInTheDocument());
  });

  it.skip('should display tooltip on click', async () => {
    // given
    render(<ThemedVisionSimulator />);
    await waitFor(() => expect(screen.getByTitle('Vision simulator')).toBeInTheDocument());

    // when
    userEvent.click(screen.getByRole('button', { name: 'Vision simulator' }));

    // then
    await waitFor(() => expect(screen.getByText('blurred vision')).toBeInTheDocument());
    baseList.forEach(({ name, percentage }) =>
      expect(getOptionByNameAndPercentage(name, percentage)).toBeInTheDocument()
    );
  });

  it.skip('should set filter', async () => {
    // given
    render(<ThemedVisionSimulator />);
    await waitFor(() => expect(screen.getByTitle('Vision simulator')).toBeInTheDocument());
    userEvent.click(screen.getByRole('button', { name: 'Vision simulator' }));
    await waitFor(() => expect(screen.getByText('blurred vision')).toBeInTheDocument());

    // when
    fireEvent.click(screen.getByText('blurred vision'));

    // then
    // eslint-disable-next-line no-undef
    const rule = Object.values(document.styleSheets)
      .filter(({ cssRules }) => cssRules)
      .map(({ cssRules }) => Object.values(cssRules))
      .flat()
      .find((cssRule: CSSRule) => cssRule.selectorText === '#storybook-preview-iframe');

    expect(rule).toBeDefined();
    expect(rule.style.filter).toBe('blur(2px)');
  });
});