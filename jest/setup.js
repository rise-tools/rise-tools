// `matchMedia` is not available in JSDOM, so we need to mock it out
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    }
  }
