//Recursive Search for Object Key
const findKey = (obj, targetKey) => {
  for (let key in obj) {
    if (key in obj && key === targetKey) {
      return obj[key];
    } else if (typeof obj[key] === "object") {
      const result = findKey(obj[key], targetKey);
      if (result) return result;
    }
  }
  return null;
};

// const testObj = { a: 1, b: 2, c: { d: 4, e: 5, f: { g: 7, h: 8 } } };
// const result = findKey(testObj, "h");
// console.log(result);

module.exports = { findKey };
