import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SessionQuestion } from '../types';
import { QuestionCard } from './QuestionCard';

const item: SessionQuestion = {
  question: {
    id: 'solid-isp-001',
    topic: 'solid',
    tag: 'ISP',
    type: 'concept',
    difficulty: 1,
    prompt: '¿Qué principio se viola?',
    options: [
      { id: 'a', text: 'Open/Closed' },
      { id: 'b', text: 'Interface Segregation' },
      { id: 'c', text: 'Liskov Substitution' },
      { id: 'd', text: 'Single Responsibility' },
    ],
    correctOptionId: 'b',
    explanation: 'La interfaz es demasiado grande.',
    optionExplanations: {
      a: 'No hay problema de extensión.',
      c: 'No hay herencia.',
      d: 'No hay mezcla de responsabilidades.',
    },
  },
  options: [
    { id: 'a', text: 'Open/Closed' },
    { id: 'b', text: 'Interface Segregation' },
    { id: 'c', text: 'Liskov Substitution' },
    { id: 'd', text: 'Single Responsibility' },
  ],
};

function renderCard(overrides: Partial<Parameters<typeof QuestionCard>[0]> = {}) {
  const props = {
    item,
    index: 0,
    total: 1,
    selectedOptionId: null,
    revealed: false,
    isLast: true,
    onSelect: vi.fn(),
    onNext: vi.fn(),
    ...overrides,
  };

  render(<QuestionCard {...props} />);
  return props;
}

describe('QuestionCard', () => {
  it('muestra el enunciado y las 4 opciones sin revelar el feedback', () => {
    renderCard();

    expect(screen.getByText('¿Qué principio se viola?')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.queryByText('Respuesta correcta')).not.toBeInTheDocument();
  });

  it('no revela la etiqueta antes de responder', () => {
    renderCard();

    // La etiqueta (ISP) es la respuesta: no debe verse en el encabezado.
    expect(screen.queryByText('ISP')).not.toBeInTheDocument();
  });

  it('muestra la etiqueta recién al responder', () => {
    renderCard({ selectedOptionId: 'b', revealed: true });

    expect(screen.getByText('ISP')).toBeInTheDocument();
  });

  it('avisa cuál era la correcta cuando la elegida es incorrecta', () => {
    renderCard({ selectedOptionId: 'a', revealed: true });

    expect(screen.getByText('No era esa')).toBeInTheDocument();
    expect(screen.getByText('La interfaz es demasiado grande.')).toBeInTheDocument();
    expect(screen.getAllByText(/Correcta/).length).toBeGreaterThan(0);
    expect(screen.getByText('No hay herencia.')).toBeInTheDocument();
  });

  it('marca la respuesta correcta sin mostrar el aviso de error', () => {
    renderCard({ selectedOptionId: 'b', revealed: true });

    expect(screen.getByText('Respuesta correcta')).toBeInTheDocument();
    expect(screen.queryByText('No era esa')).not.toBeInTheDocument();
  });

  it('delega la selección y el avance', async () => {
    const user = userEvent.setup();
    const props = renderCard();

    await user.click(screen.getByRole('button', { name: /Opción A/i }));
    expect(props.onSelect).toHaveBeenCalledWith('a');
  });

  it('llama a onNext al salir de la última pregunta', async () => {
    const user = userEvent.setup();
    const props = renderCard({ selectedOptionId: 'b', revealed: true });

    await user.click(screen.getByRole('button', { name: /Ver resultados/i }));
    expect(props.onNext).toHaveBeenCalledOnce();
  });
});

describe('QuestionCard con pista', () => {
  const withHint: SessionQuestion = {
    ...item,
    question: { ...item.question, hint: 'Mirá el contrato de la interfaz.' },
  };

  function renderWithHint(overrides: Partial<Parameters<typeof QuestionCard>[0]> = {}) {
    const props = {
      item: withHint,
      index: 0,
      total: 1,
      selectedOptionId: null,
      revealed: false,
      isLast: false,
      onSelect: vi.fn(),
      onNext: vi.fn(),
      hintVisible: false,
      onToggleHint: vi.fn(),
      ...overrides,
    };

    render(<QuestionCard {...props} />);
    return props;
  }

  it('ofrece ver la pista antes de responder', async () => {
    const user = userEvent.setup();
    const props = renderWithHint();

    await user.click(screen.getByRole('button', { name: /Ver pista/i }));
    expect(props.onToggleHint).toHaveBeenCalledOnce();
    expect(screen.queryByText('Mirá el contrato de la interfaz.')).not.toBeInTheDocument();
  });

  it('muestra el texto cuando la pista está visible', () => {
    renderWithHint({ hintVisible: true });

    expect(screen.getByText('Mirá el contrato de la interfaz.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ocultar pista/i })).toBeInTheDocument();
  });

  it('no ofrece pista después de responder', () => {
    renderWithHint({ revealed: true, selectedOptionId: 'b' });

    expect(screen.queryByRole('button', { name: /pista/i })).not.toBeInTheDocument();
  });
});
