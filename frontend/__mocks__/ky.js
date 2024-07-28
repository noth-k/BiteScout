const ky = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(() => ky),
  };
  
  export default ky;
  