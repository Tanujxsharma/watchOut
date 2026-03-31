const request = require('supertest');
const express = require('express');
const tenderRoutes = require('../src/routes/tenderRoutes');
const { createTender, getAllTenders } = require('../src/controllers/tenderController');

// Mock Firebase and Auth Middleware
jest.mock('../src/config/firebase', () => ({
  firestore: {
    collection: () => ({
      doc: () => ({
        set: jest.fn(),
        get: jest.fn(() => ({ exists: true, data: () => ({}) })),
        delete: jest.fn(),
        update: jest.fn()
      }),
      where: () => ({
        get: jest.fn(() => ({
          forEach: (cb) => {
            cb({ data: () => ({ id: '1', title: 'Test Tender', budget: 1000 }) });
          }
        }))
      }),
      get: jest.fn(() => ({
        forEach: (cb) => {
          cb({ data: () => ({ id: '1', title: 'Test Tender', budget: 1000 }) });
        }
      }))
    })
  }
}));

jest.mock('../src/middleware/authMiddleware', () => ({
  verifyGovernmentToken: (req, res, next) => {
    req.governmentUser = { email: 'admin@gov.in' };
    next();
  },
  verifyToken: (req, res, next) => next()
}));

jest.mock('../src/services/activityLogService', () => ({
  logActivity: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/tenders', tenderRoutes);

describe('Tender API', () => {
  it('GET /api/tenders should return all tenders', async () => {
    const res = await request(app).get('/api/tenders');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].title).toBe('Test Tender');
  });

  it('POST /api/tenders should create a new tender', async () => {
    const newTender = {
      title: 'New Road Construction',
      description: 'Construction of 5km road in Sector 45. Requires heavy machinery.',
      budget: 5000000,
      deadline: new Date().toISOString(),
      category: 'Infrastructure',
      location: 'New Delhi',
      requirements: ['Class A Contractor License', '3 years experience']
    };

    const res = await request(app)
      .post('/api/tenders')
      .send(newTender);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Tender created successfully');
    expect(res.body.tender.title).toBe(newTender.title);
  });

  it('POST /api/tenders should fail with invalid data', async () => {
    const invalidTender = {
      title: 'Short', // Too short
      budget: -100 // Negative budget
    };

    const res = await request(app)
      .post('/api/tenders')
      .send(invalidTender);

    expect(res.statusCode).toEqual(500); // Zod validation error usually throws 500 in our error handler unless mapped
  });
});
