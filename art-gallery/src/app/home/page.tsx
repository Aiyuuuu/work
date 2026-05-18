import ImageCard from "@/components/ImageCard/ImageCard";

const images = [
  {
    id: "1",
    imageUrl: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2caa154a-278a-4c00-8b20-0d2adac6ea75/anim=false,width=450,optimized=true/130412366.jpeg",
  },
  {
    id: "2",
    imageUrl: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/15f3866d-4c5f-4685-a521-04343d8f134e/anim=false,width=450,optimized=true/130386340.jpeg",
  },
  {
    id: "3",
    imageUrl: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/8cf9a0ba-00c1-412f-a894-3c6e075ded83/anim=false,width=450,optimized=true/130710134.jpeg",
  },
];

export default function HomePage() {
  return (
    <main style={styles.container}>
      <div style={styles.grid}>
        {images.map((img) => (
          <ImageCard key={img.id} id={img.id} imageUrl={img.imageUrl} />
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
};