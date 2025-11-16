import Image from "./Image";

interface CardProps {
  imageUrl: string;
  name: string;
  description?: string;
}

export default function Card(props: CardProps) {
  return (
    <div className="rounded-xl border border-theme-primary-border px-4 py-3 pb-5">
      <Image src={props.imageUrl} alt={props.name} className="rounded" />
      <div className="mt-2 space-y-2">
        <h2 className="text-black font-semibold text-sm">{props.name}</h2>
        {props.description && (
          <p className="text-xs text-theme-description">{props.description}</p>
        )}
      </div>
    </div>
  );
}
