
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="p-10">
      <h1>Category route is working!</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}
