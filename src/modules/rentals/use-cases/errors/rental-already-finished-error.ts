export class RentalAlreadyFinishedError extends Error {
  constructor() {
    super("Este aluguel já foi finalizado.");
  }
}
