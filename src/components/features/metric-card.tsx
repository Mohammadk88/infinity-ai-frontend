import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradientColors?: string;
  loading?: boolean;
  className?: string;
  formatter?: (value: string | number) => string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  gradientColors = "from-primary/60 to-primary/80",
  loading = false,
  className,
  formatter = (val) => val.toString(),
}: MetricCardProps) {
  const formattedValue = formatter(value);
  
  return (
    <Card className={cn("border-muted/40 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold flex items-center">
            {Icon && <Icon className={cn("h-5 w-5 mr-1", iconColor)} />}
            {formattedValue}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
      <div className={cn(`h-2 bg-gradient-to-r ${gradientColors} w-full`)} />
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconBackground?: string;
  iconColor?: string;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconBackground = "bg-primary/10",
  iconColor = "text-primary",
  loading = false,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("border-muted/40", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {value}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {Icon && (
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBackground, iconColor)}>
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}