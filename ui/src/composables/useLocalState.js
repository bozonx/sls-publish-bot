const STATE_PREFIX = "STATE_";

export const useLocalStateGet = (key) => {
  const value = localStorage.getItem(STATE_PREFIX + key);

  if (!value) return value;

  return JSON.parse(value);
};

export const useLocalStateSet = (key, value) => {
  localStorage.setItem(STATE_PREFIX + key, value && JSON.stringify(value));
};

export const useLocalStateRemove = (key) => {
  localStorage.removeItem(STATE_PREFIX + key);
};
