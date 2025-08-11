import NetflixMovieCard from "./NetflixMovieCard";
import { Movie } from "@/types/movie";

interface TopTenRowProps {
  title?: string;
  items: Movie[];
  onItemClick?: (item: Movie) => void;
}

const TopTenRow = ({ title = "Top 10 Today", items, onItemClick }: TopTenRowProps) => {
  if (!items?.length) return null;

  const top10 = items.slice(0, 10);

  return (
    <section className="relative mb-12">
      <h2 className="text-foreground text-xl md:text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>

      <div className="px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex gap-3 md:gap-4">
          {top10.map((item, index) => (
            <div key={item.id} className="relative w-[48%] sm:w-[31%] md:w-[18%] lg:w-[10%]">
              {/* Rank Number */}
              <div className="absolute -left-2 -bottom-2 md:-left-4 md:-bottom-4 select-none pointer-events-none">
                <span className="text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] font-black leading-none text-white/10">
                  {index + 1}
                </span>
              </div>

              <div className="relative">
                <NetflixMovieCard
                  title={item.title}
                  year={item.year}
                  rating={item.rating}
                  genre={item.genre}
                  imageUrl={item.imageUrl}
                  duration={item.duration}
                  onPlay={() => onItemClick?.(item)}
                  onAddToList={() => console.log("Add to list:", item.title)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTenRow;
