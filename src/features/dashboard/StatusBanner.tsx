type StatusBannerProps = {
  message: string;
};

export function StatusBanner({ message }: StatusBannerProps) {
  return (
    <div
      className="mt-8 rounded-card px-5 py-4"
      style={{
        backgroundColor: "rgba(196, 118, 58, 0.1)",
        border: "0.5px solid rgba(196, 118, 58, 0.25)",
      }}
      role="status"
    >
      <p className="text-body text-ink">{message}</p>
    </div>
  );
}
