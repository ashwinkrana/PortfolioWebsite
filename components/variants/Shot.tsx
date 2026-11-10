import Image from "next/image";

export default function Shot({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={750}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={`h-auto w-full ${className}`}
    />
  );
}
