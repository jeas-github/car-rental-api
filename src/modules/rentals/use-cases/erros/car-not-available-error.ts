export class CarNotAvailableError extends Error {
  constructor() {
    super("O carro selecionado não está disponível para aluguel.");
  }
}
