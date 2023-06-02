export function flattening(data, childLabel) {
  const flatArr = [];
  flatArr.push(data);

  function flat(arr) {
    arr.forEach((item) => {
      flatArr.push(item);
      if (Array.isArray(item[childLabel]) && item[childLabel].length > 0) {
        flat(item[childLabel]);
      }
    });
  }

  if (Array.isArray(data[childLabel]) && data[childLabel].length > 0) {
    flat(data[childLabel]);
  }

  return flatArr;
}
