interface Props {
  size?: number;
  withoutContainer?: boolean;
}

export const Loader = ({ size = 16, withoutContainer }: Props) => {
  const loader = (
    <div
      className={`h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}
    ></div>
  );

  if (withoutContainer) return loader;

  return (
    <div className={`flex h-screen items-center justify-center`}>{loader}</div>
  );
};
