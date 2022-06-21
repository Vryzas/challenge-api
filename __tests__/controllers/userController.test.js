const userController = require('../../controllers/userController');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { res, next, clearMockRes } = getMockRes();

jest.mock('jsonwebtoken');
jest.mock('../../utils/email');

jest.mock(
  '../../dao/userDao',
  () => (dao = { profile: jest.fn(), findByParam: jest.fn(), findUser: jest.fn(), save: jest.fn() })
);

jest.mock('../../dao/statsDao', () => (stats = { create: jest.fn(), findUser: jest.fn(), save: jest.fn() }));

afterEach(() => {
  // clear the responses after each test (else they accumulate)
  clearMockRes();
});

describe('getMe', () => {
  test('Invalid username.', async () => {
    // arrange
    const req = getMockReq({ query: { username: 'wrongUsername' } });
    dao.profile.mockReturnValue(undefined);
    // act
    await userController.getMe(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: `Failed to get ${req.query.username} profile data!` });
  });

  test('Valid username.', async () => {
    // arrange
    const req = getMockReq({ query: { username: 'username' } });
    dao.profile.mockReturnValue({
      username: 'username',
      email: 'email@email.com',
      victories: 0,
      draws: 0,
      defeats: 0,
    });
    // act
    await userController.getMe(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Success.',
      data: {
        username: 'username',
        email: 'email@email.com',
        victories: 0,
        draws: 0,
        defeats: 0,
      },
    });
  });
});

describe('activateAccount', () => {
  test('Invalid token.', async () => {
    // arrange
    const req = getMockReq({ params: { token: 'badToken' } });
    dao.findByParam.mockReturnValue(undefined);
    // act
    await userController.activateAccount(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Valid token.', async () => {
    // arrange
    const req = getMockReq({ params: { token: 'token' } });
    dao.findByParam.mockReturnValue({ user: { username: 'username' } });
    stats.create.mockReturnValue(true);
    await dao.save.mockReturnValue(true);
    // act
    await userController.activateAccount(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your account has been activated successfully.' });
  });
});

describe('forgotPassword', () => {
  test('Invalid email.', async () => {
    // arrange
    const req = getMockReq({ body: { email: 'wrongEmail' } });
    dao.findByParam.mockReturnValue(undefined);
    // act
    await userController.forgotPassword(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('User profile not activated.', async () => {
    // arrange
    const req = getMockReq({ body: { email: 'email' } });
    dao.findByParam.mockReturnValue({ username: 'username', active: false });
    // act
    await userController.forgotPassword(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Valid profile.', async () => {
    // arrange
    const req = getMockReq({ body: { email: 'email', token: 'token' } });
    dao.findByParam.mockReturnValue({ username: 'username', active: true });
    dao.save.mockReturnValue(true);
    // act
    await userController.forgotPassword(req, res, next);
    // assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email has been sent. Check your inbox for password recovery instructions.',
    });
  });
});

describe('resetPassword', () => {
  test('Altered or used token.', async () => {
    // arrange
    const req = getMockReq({ params: { token: 'badToken' } });
    dao.findByParam.mockReturnValue(null);
    // act
    await userController.resetPassword(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Expired token.', async () => {
    // arrange
    const req = getMockReq({ params: { token: 'expiredToken' } });
    dao.findByParam.mockReturnValue({ passwordResetExpires: new Date(+Date.now()) - 1000 });
    // act
    await userController.resetPassword(req, res, next);
    // assert
    expect(next).toHaveBeenCalled();
  });

  test('Valid token.', async () => {
    // arrange
    const req = getMockReq({ params: { token: 'token' } });
    dao.findByParam.mockReturnValue({ passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000) });
    // act
    await userController.resetPassword(req, res, next);
    // assert
    // expect(next).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(302);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please insert a new password in the highlighted field.',
    });
  });
});
