export class CarAlreadyExistsError extends Error {
  constructor() {
    super("Um carro com esta placa já existe.");
  }
}
