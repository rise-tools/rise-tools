global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    }
  }
