const proxy = new Proxy({}, {
  get: (target, key) => {
    if (key === '__esModule') {
      return true;
    }
    if (key === 'default') {
      return proxy;
    }
    return key;
  }
});

module.exports = proxy;
