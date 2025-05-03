
/**
 * Utility hook to validate and normalize preview status
 */
export const useValidatePreviewStatus = () => {
  /**
   * Ensures the status is one of the valid values: 'waiting', 'feedback', or 'approved'
   */
  const validateStatus = (status?: string): 'waiting' | 'feedback' | 'approved' => {
    if (status === 'waiting' || status === 'feedback' || status === 'approved') {
      return status;
    }
    return 'waiting';
  };

  return { validateStatus };
};

export default useValidatePreviewStatus;
