module.exports = (() => {
  const statuses = {
    SUCCESS: 'success',
    FETCHING: 'fetching',
    ERROR: 'error',
  };

  const checks = {
    isSuccess(status) {
      return status === statuses.SUCCESS;
    },
    isFetching(status) {
      return status === statuses.FETCHING;
    },
    isError(status) {
      return status === statuses.ERROR;
    },
  };

  return Object.assign({}, statuses, checks);
})();
