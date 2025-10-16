export class RentalPointAlreadyExistsError extends Error {
  constructor() {
    super("Um ponto de aluguel com este nome já existe.");
  }
}
