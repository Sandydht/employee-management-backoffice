import { ToSnakeCasePipe } from './to-snake-case-pipe';

describe('ToSnakeCasePipe', () => {
  it('create an instance', () => {
    const pipe = new ToSnakeCasePipe();
    expect(pipe).toBeTruthy();
  });
});
