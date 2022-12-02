/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    testPathIgnorePatterns: [
        'dist',
        'src/entities',
        'node_modules/supertest/lib/test',
    ],
    coveragePathIgnorePatterns: [
        'src/entities',
        'node_modules/supertest/lib/test',
    ],
    resolver: 'jest-ts-webcompat-resolver',
};
