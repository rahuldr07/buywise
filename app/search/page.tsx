import { SearchExperience } from "@/components/search/search-experience";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return <SearchExperience initialQuery={q ?? ""} />;
}
