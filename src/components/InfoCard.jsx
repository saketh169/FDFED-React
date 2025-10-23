export default function InfoCard({ title, children }) {
  return (
    <div className="bg-background-light border border-primary-green rounded-lg p-4 shadow hover:shadow-md">
      <h4 className="text-primary-green font-bold mb-2">{title}</h4>
      <div>{children}</div>
    </div>
  );
}