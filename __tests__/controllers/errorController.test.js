const errorController = require('../../controllers/errorController');

beforeAll(() => {
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  global.console.error.mockRestore();
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockError = (val) => {
  return { error: 'err', message: 'errmsg', stack: 'errstack', status: '', statusCode: val };
};

describe('Error controller tests', () => {
  it('If error not processed', () => {
    // arrange
    const err = mockError(500);
    // act
    const response = errorController(err, null, null, null);
    // assert
    expect(response).toBeUndefined();
  });

  it('If send error dev.', () => {
    // arrange
    const err = mockError(404);
    const res = mockResponse();
    res.json({ status: 'err.status', error: 'err', message: 'err.message', stack: 'err.stack' });
    process.env.NODE_ENV = 'development';
    // act
    errorController(err, null, res, null);
    // assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toBeDefined();
  });

  it('If send error prod.', () => {
    // arrange
    const err = mockError(500);
    const res = mockResponse();
    res.json({
      status: 'error',
      message: 'Something went wrong!',
    });
    process.env.NODE_ENV = 'production';
    // act
    errorController(err, null, res, null);
    // assert
    expect(console.error).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!',
    });
  });
});
