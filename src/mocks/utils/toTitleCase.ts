export const toTitleCase = (str: string): string => {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
