const authController = require('../../controllers/authController');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { res, next, clearMockRes } = getMockRes();
// const req = getMockReq();

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
