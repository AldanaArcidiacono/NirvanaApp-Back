/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        'dist',
        'src/entities',
        'node_modules/supertest/lib/test',
        'src/middleware',
    ],
    coveragePathIgnorePatterns: [
        'src/entities',
        'node_modules/supertest/lib/test',
        'src/middleware',
    ],
    resolver: 'jest-ts-webcompat-resolver',
};
