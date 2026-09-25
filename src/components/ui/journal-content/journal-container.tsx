import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { journalPosts } from "@/lib/values/journal";
import { formatCategoryName } from "@/lib/helper/format-category-name";

export default function JournalContainer() {
  return (
    <section aria-labelledby="page-title">
      <div className="journal-list">
        {(Object.keys(journalPosts) as (keyof typeof journalPosts)[]).map(category => {
          const posts = journalPosts[category];
          const preview = category === "devfest_davao_2025" ? posts.find(p => p.src === "/devfest_davao/devfest_davao_3.jpg") ?? posts[0] : posts[0];
          return (
            <Link key={category} href={`/journal/${category}`} className="journal-entry spotlight-entry">
              <div><h3 className="item-title">{formatCategoryName(category)} <ArrowUpRight size={13} aria-hidden="true" /></h3><p className="item-meta">{posts.length} photographs</p></div>
              {preview && <div className="journal-preview"><Image src={preview.src} alt={formatCategoryName(category)} fill sizes="(max-width: 639px) calc(100vw - 48px), (min-width: 1024px) 500px, 280px" className="object-cover" /></div>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
