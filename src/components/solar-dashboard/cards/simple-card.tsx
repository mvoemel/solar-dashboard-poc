type SimpleCardProps = {
  title: string;
  content: React.ReactNode;
};

export function SimpleCard({ title, content }: SimpleCardProps) {
  return (
    <div className="rounded-lg bg-muted flex-col gap-4 p-2 items-center">
      <div className="text-3xl">{content}</div>
      <p className="text-muted-foreground">{title}</p>
    </div>
  );
}
