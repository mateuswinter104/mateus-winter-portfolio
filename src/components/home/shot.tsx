import Image from "next/image";
import type { ProjectShot } from "@/content/projects";
import { cn } from "@/lib/utils";

type ShotProps = {
  shot: ProjectShot;
  available: boolean;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  position?: "top" | "center";
};

export function Shot({ shot, available, alt, sizes, className, priority, position = "top" }: ShotProps) {
  if (!available) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("size-full bg-[repeating-linear-gradient(135deg,var(--muted)_0_1px,transparent_1px_14px)]", className)}
      />
    );
  }

  return (
    <Image
      src={shot.src}
      alt={alt}
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      priority={priority}
      className={cn("size-full object-cover", position === "top" ? "object-top" : "object-center", className)}
    />
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent_70%)] py-[6%]">
      <div className="relative aspect-[9/19.5] h-full overflow-hidden rounded-[1.6rem] border-4 border-foreground/90 bg-background shadow-2xl">
        {children}
      </div>
    </div>
  );
}
