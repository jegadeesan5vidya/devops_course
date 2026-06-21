const CircuitBreaker = require('opossum');

const breakerOptions = {
    timeout: 3000,               // If Mongo takes >3s → fail fast
    errorThresholdPercentage: 50, // Open breaker if 50% of calls fail
    resetTimeout: 10000           // Try again after 10 seconds
};

const createBreaker = (fn) => {
    const breaker = new CircuitBreaker(fn, breakerOptions);

    breaker.fallback(() => ({
        success: false,
        message: 'Service temporarily unavailable (circuit open)'
    }));

    breaker.on('open', () => console.warn('⚠ Circuit breaker OPEN — Mongo unreachable'));
    breaker.on('halfOpen', () => console.warn('⏳ Circuit breaker HALF-OPEN — testing connection'));
    breaker.on('close', () => console.log('✅ Circuit breaker CLOSED — Mongo restored'));

    return breaker;
};

module.exports = createBreaker;
