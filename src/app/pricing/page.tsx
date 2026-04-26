import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  return (
    <div className="py-20 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center">Simple, Transparent Pricing</h1>
      <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl">Upgrade your simulation experience with premium features to master the market.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Basic Tier */}
        <Card className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Basic</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $0
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>$10,000 starting balance</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>Follow up to 10 stocks</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>Basic charting tools</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Pro Tier */}
        <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
            Recommended
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Pro Trader</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $15
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Unlimited starting balance</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Unlimited followed stocks</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Advanced indicators & signals</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Options trading simulation</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Upgrade to Pro</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
