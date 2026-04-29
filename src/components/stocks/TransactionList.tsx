import { getHistory } from "@/dal/stocks";
import { TransactionTable } from "./TransactionTable";

interface TransactionListProps {
  pagePromise: Promise<number>;
  filterPromise: Promise<string>;
  timezonePromise: Promise<string>;
}

export async function TransactionList({ 
  pagePromise, 
  filterPromise, 
  timezonePromise 
}: TransactionListProps) {
  const page = await pagePromise;
  const filter = await filterPromise;
  const timezone = await timezonePromise;
  const limit = 20;

  const data = await getHistory(page, limit, filter, timezone);

  if (!data || data.transactions.length === 0) {
    return (
      <div className="text-center p-16 border-2 border-dashed rounded-[2rem] bg-muted/10 text-muted-foreground">
        {page > 1 || filter ? "No more transactions found matching your criteria." : "No transactions yet. Start trading to see your activity here."}
      </div>
    );
  }

  return (
    <TransactionTable 
      transactions={data.transactions}
      total={data.total}
      page={page}
      limit={limit}
      filter={filter}
      timezone={timezone}
    />
  );
}
