import Image from "next/image";
import type { ProjectMedia as Media } from "@/types/project";

export function ProjectMedia({ media, hero = false }: { media: Media; hero?: boolean }) {
  return <figure className={`project-media ${media.kind}`}><Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes={hero ? "100vw" : "(max-width: 899px) 90vw, 65vw"} priority={hero} /><figcaption>{media.caption}</figcaption></figure>;
}
