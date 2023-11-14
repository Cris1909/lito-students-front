import { PatterRegex } from '../constants';

export const isImageUrl = async (url: string): Promise<boolean> => {
  if (!PatterRegex.url.test(url)) return false;
  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};
