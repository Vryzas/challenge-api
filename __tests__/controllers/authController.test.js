const authController = require('../../controllers/authController');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { res, next, clearMockRes } = getMockRes();
// const req = getMockReq();

jest.mock('jsonwebtoken');
jest.mock('../../utils/appError');
jest.mock('../../utils/email');

jest.mock('../../dao/userDao', () => (dao = { create: jest.fn(), findUser: jest.fn(), save: jest.fn() }));
