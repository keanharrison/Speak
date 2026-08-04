type StatusBannerProps = {
  message: string;
};

export function StatusBanner({ message }: StatusBannerProps) {
  return (
    <div className="glass-panel mt-8 px-5 py-4" role="status">
      <p className="text-body text-ink">{message}</p>
    </div>
  );
}
