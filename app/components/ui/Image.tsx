import { useState, useRef, useEffect, forwardRef, type ImgHTMLAttributes } from "react";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  lazy?: boolean;
  quality?: number;
  fallback?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
}

interface ImageState {
  isLoaded: boolean;
  hasError: boolean;
  isInView: boolean;
}

const isSvg = (src: string): boolean => {
  return src.toLowerCase().includes(".svg") || src.includes("data:image/svg");
};

const generateSrcSet = (src: string, quality = 75): string => {
  if (isSvg(src)) {
    return src;
  }

  const baseUrl = src.split("?")[0];
  const extension = baseUrl.split(".").pop()?.toLowerCase();

  if (!extension || !["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return src;
  }

  const widths = [640, 828, 1200, 1920, 2048];
  return widths
    .map(width => {
      if (src.includes("?")) {
        return `${src}&w=${width}&q=${quality} ${width}w`;
      }
      return `${src}?w=${width}&q=${quality} ${width}w`;
    })
    .join(", ");
};

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      sizes = "100vw",
      priority = false,
      lazy = true,
      quality = 75,
      fallback = "/placeholder.svg",
      placeholder,
      onLoad,
      onError,
      className = "",
      objectFit = "cover",
      objectPosition = "center",
      style,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = useState<ImageState>({
      isLoaded: false,
      hasError: false,
      isInView: priority,
    });

    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver>();

    useEffect(() => {
      if (priority || !lazy) {
        setState(prev => ({ ...prev, isInView: true }));
        return;
      }

      if (!imgRef.current) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setState(prev => ({ ...prev, isInView: true }));
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: "50px",
          threshold: 0.1,
        },
      );

      observerRef.current.observe(imgRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }, [priority, lazy]);

    const handleLoad = () => {
      setState(prev => ({ ...prev, isLoaded: true }));
      onLoad?.();
    };

    const handleError = () => {
      setState(prev => ({ ...prev, hasError: true }));
      onError?.();
    };

    const shouldShowImage = state.isInView && !state.hasError;
    const shouldShowPlaceholder = !state.isLoaded && shouldShowImage && placeholder && !isSvg(src);
    const shouldShowFallback = state.hasError;
    const isImageSvg = isSvg(src);

    const imageStyles = {
      objectFit: isImageSvg ? ("contain" as const) : objectFit,
      objectPosition,
      transition: isImageSvg ? "none" : "opacity 0.3s ease-in-out",
      opacity: isImageSvg ? 1 : state.isLoaded ? 1 : 0,
      ...style,
    };

    const containerStyles = {
      display: "inline-block",
      position: "relative" as const,
      overflow: "hidden",
      width: width ? `${width}px` : "100%",
      height: height ? `${height}px` : "auto",
    };

    const placeholderStyles = {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      filter: "blur(10px)",
      transform: "scale(1.1)",
      opacity: shouldShowPlaceholder ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
      zIndex: 1,
    };

    const mainImageStyles = {
      ...imageStyles,
      position: "relative" as const,
      zIndex: 2,
    };

    return (
      <div style={containerStyles} className={className}>
        {shouldShowPlaceholder && (
          <img src={placeholder} alt="" style={placeholderStyles} aria-hidden="true" />
        )}

        {shouldShowImage && (
          // biome-ignore lint/a11y/useAltText: <explanation>
          <img
            ref={node => {
              imgRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            src={src}
            srcSet={isImageSvg ? undefined : generateSrcSet(src, quality)}
            sizes={isImageSvg ? undefined : sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={isImageSvg ? undefined : "async"}
            onLoad={handleLoad}
            onError={handleError}
            style={mainImageStyles}
            {...props}
          />
        )}

        {shouldShowFallback && (
          // biome-ignore lint/a11y/useAltText: <explanation>
          <img
            src={fallback}
            alt={alt}
            width={width}
            height={height}
            style={imageStyles}
            {...props}
          />
        )}
      </div>
    );
  },
);

Image.displayName = "Image";

export default Image;
