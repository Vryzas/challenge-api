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
