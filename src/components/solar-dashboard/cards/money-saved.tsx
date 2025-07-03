import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type MoneySavedCardProps = {
  moneySavedThisMonth: number;
  moneySavedPreviousMonth: number;
};

export function MoneySavedCard({
  moneySavedThisMonth,
  moneySavedPreviousMonth,
}: MoneySavedCardProps) {
  const calculatePercentageChange = () => {
    if (moneySavedPreviousMonth === 0) {
      // Handle edge case where last month was 0
      return moneySavedThisMonth > 0 ? 100 : 0;
    }

    const change =
      ((moneySavedThisMonth - moneySavedPreviousMonth) /
        Math.abs(moneySavedPreviousMonth)) *
      100;
    return Math.abs(change);
  };

  const percentageChange = calculatePercentageChange();
  const isIncreasing = moneySavedThisMonth >= moneySavedPreviousMonth;

  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>Money saved this month</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {new Intl.NumberFormat("de-CH").format(
            Math.round(moneySavedThisMonth)
          )}{" "}
          CHF
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium text-sm">
          {isIncreasing ? (
            <>
              <TrendingUpIcon className="size-5 text-green-500" />
            </>
          ) : (
            <>
              <TrendingDownIcon className="size-5 text-red-500" />
            </>
          )}
          <span>{Math.round(percentageChange)}% vs last month</span>
        </div>
      </CardFooter>
    </Card>
  );
}
