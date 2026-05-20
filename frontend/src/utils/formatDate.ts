export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const toInputDateFormat = (isoString: string): string => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};
