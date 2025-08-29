const noop = () => {
  /* test noop */
};

export const useToast = () => ({
  success: noop,
  error: noop,
  warning: noop,
  info: noop,
  showToast: noop,
});
