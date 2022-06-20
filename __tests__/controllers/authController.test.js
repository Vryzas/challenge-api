const authController = require('../../controllers/authController');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { res, next, clearMockRes } = getMockRes();

jest.mock('jsonwebtoken');
jest.mock('../../utils/appError');
jest.mock('../../utils/email');

jest.mock('../../dao/userDao', () => (dao = { create: jest.fn(), findUser: jest.fn(), save: jest.fn() }));
afterEach(() => {
  // clear the responses after each test (else they accumulate)
  clearMockRes();
});

describe('Signup', () => {
  test('No parameters.', async () => {
    // arrange
    const req = getMockReq();
    dao.create.mockRejectedValue('NullValuesError');
    // act
    authController.signup(req, res, next);
    // assert
    expect(dao.create).rejects.toMatch('NullValuesError');
  });

  test('Valid parameters.', async () => {
    // arrange
    const req = getMockReq({ body: { username: 'username', email: 'email', password: 'password', token: 'token' } });
    dao.create.mockReturnValue(true);
    // act
    await authController.signup(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Your profile has been created, please check your email for the activation message.',
    });
  });
});

describe('Login - ', () => {
  test('No parameters.', async () => {
    // arrange
    const req = getMockReq();
    // act
    await authController.login(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please provide username and password!' });
  });

  test('Invalid username.', async () => {
    // arrange
    const req = getMockReq({ body: { username: 'wrong username', password: 'password' } });
    dao.findUser.mockReturnValue(null);
    // act
    await authController.login(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Database Error', async () => {
    // arrange
    const req = getMockReq({ body: { username: 'username', password: 'password' } });
    dao.findUser.mockRejectedValue('DatabaseConnectionError');
    // act
    const response = authController.login(req, res, next);
    // assert
    expect(response).rejects.toMatch('DatabaseConnectionError');
  });

  test('Invalid password.', async () => {
    // arrange
    const req = getMockReq({ body: { username: 'username', password: 'wrongPassword' } });
    dao.findUser.mockReturnValue((user = { username: 'username', password: 'password' }));
    // act
    await authController.login(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Valid username and password.', async () => {
    // arrange
    const req = getMockReq({ body: { username: 'username', password: 'password' } });
    dao.findUser.mockReturnValue(
      (user = { username: 'username', password: 'password', email: 'email', logedIn: true })
    );
    // act
    await authController.login(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful.',
      data: {
        email: 'email',
        username: 'username',
      },
    });
  });
});

describe('Logout', () => {
  test('Invalid username.', async () => {
    // arrange
    const req = getMockReq({ params: { username: '' } });
    dao.findUser.mockReturnValue(null);
    // act
    await authController.logout(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Invalid state.', async () => {
    // arrange
    const req = getMockReq({ params: { username: 'username' } });
    dao.findUser.mockReturnValue((user = { username: 'username', logedIn: false }));
    // act
    await authController.logout(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Valid username and valid state.', async () => {
    // arrange
    const req = getMockReq({ params: { username: 'username' } });
    dao.findUser.mockReturnValue((user = { username: 'username', logedIn: true }));
    // act
    await authController.logout(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logout successful.',
    });
  });
});
