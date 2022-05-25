describe('Sample Test', () => {
  it('If test environmet is true.', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
