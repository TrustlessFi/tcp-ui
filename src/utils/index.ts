export const isDevEnvironment = process.env.NODE_ENV === 'development';

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
