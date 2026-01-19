export const useFilterSignal = () => {
  const filterStatus = useState<number>("filter-status", () => 0);

  const markFilterApplied = () => {
    filterStatus.value = 1;
  };

  const resetFilterStatus = () => {
    filterStatus.value = 0;
  };

  return {
    filterStatus,
    markFilterApplied,
    resetFilterStatus,
  };
};
