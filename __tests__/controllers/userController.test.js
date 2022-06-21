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
