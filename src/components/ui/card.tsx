import Image from "./Image";

interface CardProps {
  imageUrl: string;
  name: string;
  description?: string;
  width?: string;
  height?: string;
  imageHeight?: string;
  className?: string;
}

export default function Card(props: CardProps) {
  const {
    imageUrl,
    name,
    description,
    width,
    height,
    imageHeight = "h-40",
    className = "",
  } = props;

  const containerStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`rounded-xl border border-theme-primary-border px-4 py-3 pb-5 ${className}`}
      style={containerStyle}
    >
      <div className={`relative ${imageHeight} w-full`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          objectFit="cover"
          className="rounded"
        />
      </div>
      <div className="mt-2 space-y-2">
        <h2 className="text-black font-medium text-base">{name}</h2>
        {description && (
          <p className="text-xs text-theme-description">{description}</p>
        )}
      </div>
    </div>
  );
}
