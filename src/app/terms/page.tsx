export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 prose dark:prose-invert">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        Welcome to TradeSim. By using this application, you agree to the following terms.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">Educational Purposes Only</h2>
      <p className="text-muted-foreground leading-relaxed">
        TradeSim is a simulation environment. The data provided, including stock prices and charts, is meant for educational and simulation purposes only. It should not be construed as financial advice.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">Simulation Money</h2>
      <p className="text-muted-foreground leading-relaxed">
        The balance shown in your account is entirely fictional and holds no real-world value.
      </p>
    </div>
  );
}
