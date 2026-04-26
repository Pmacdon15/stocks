export default async function HeaderStockPage({
  symbolPromise,
}: {
  symbolPromise: Promise<string>;
}) {
  const symbol = await symbolPromise;
  return <h1 className="text-3xl font-bold tracking-tight">Trade {symbol}</h1>;
}
