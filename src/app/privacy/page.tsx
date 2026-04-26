export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 prose dark:prose-invert">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        This is a stock trading simulation application intended strictly for educational purposes. We do not use real money, nor do we facilitate any actual financial transactions.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">Data Collection</h2>
      <p className="text-muted-foreground leading-relaxed">
        We collect only the minimum amount of data required to provide authentication and maintain your simulated portfolio state.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">No Data Selling</h2>
      <p className="text-muted-foreground leading-relaxed">
        We value your privacy. We do not, and will never, sell your personal data to third parties.
      </p>
    </div>
  );
}
