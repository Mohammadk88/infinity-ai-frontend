'use client';

import { useState } from 'react';
import { 
  Gift, 
  Star, 
  Trophy, 
  Coins, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from "@/lib/utils";

// Types for rewards data
interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: React.ReactNode;
  category: 'ai' | 'subscription' | 'feature' | 'premium';
  available: boolean;
}

interface UserPoints {
  total: number;
  available: number;
  lifetime: number;
}

interface RedemptionHistory {
  id: string;
  rewardName: string;
  pointsSpent: number;
  redeemedAt: string;
  status: 'completed' | 'pending' | 'expired';
}

export default function PointsRewardsPage() {
  const [userPoints, setUserPoints] = useState<UserPoints>({ total: 2750, available: 2750, lifetime: 4200 });
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  // Mock rewards data
  const rewards: Reward[] = [
    {
      id: 'ai-credits-5',
      name: 'Free AI Content Generation (x5)',
      description: 'Generate 5 pieces of content using AI tools',
      pointsRequired: 500,
      icon: <Sparkles className="h-5 w-5" />,
      category: 'ai',
      available: true
    },
    {
      id: 'ai-credits-15',
      name: 'Free AI Content Generation (x15)',
      description: 'Generate 15 pieces of content using AI tools',
      pointsRequired: 1200,
      icon: <Zap className="h-5 w-5" />,
      category: 'ai',
      available: true
    },
    {
      id: 'upgrade-small',
      name: 'Upgrade to Small Business (1 Month)',
      description: 'Get premium features for 30 days',
      pointsRequired: 1500,
      icon: <Crown className="h-5 w-5" />,
      category: 'subscription',
      available: true
    },
    {
      id: 'feature-highlight',
      name: 'Feature Highlight on Dashboard',
      description: 'Get your content featured prominently',
      pointsRequired: 2500,
      icon: <Star className="h-5 w-5" />,
      category: 'feature',
      available: true
    },
    {
      id: 'premium-support',
      name: 'Priority Support (1 Month)',
      description: 'Get priority customer support for 30 days',
      pointsRequired: 3000,
      icon: <Trophy className="h-5 w-5" />,
      category: 'premium',
      available: false
    }
  ];

  // Mock redemption history
  const redemptionHistory: RedemptionHistory[] = [
    {
      id: 'r1',
      rewardName: 'Free AI Content Generation (x5)',
      pointsSpent: 500,
      redeemedAt: '2024-05-25',
      status: 'completed'
    },
    {
      id: 'r2',
      rewardName: 'Feature Highlight on Dashboard',
      pointsSpent: 2500,
      redeemedAt: '2024-05-20',
      status: 'completed'
    }
  ];

  const handleRedeem = (reward: Reward) => {
    if (userPoints.available >= reward.pointsRequired) {
      setSelectedReward(reward.id);
      // Simulate redemption
      setTimeout(() => {
        setUserPoints(prev => ({
          ...prev,
          available: prev.available - reward.pointsRequired
        }));
        setSelectedReward(null);
        // Show success message
      }, 1500);
    }
  };

  const getProgressToNextReward = () => {
    const nextReward = rewards.find(r => r.pointsRequired > userPoints.available && r.available);
    if (!nextReward) return null;
    
    const pointsNeeded = nextReward.pointsRequired - userPoints.available;
    const progress = (userPoints.available / nextReward.pointsRequired) * 100;
    
    return {
      reward: nextReward,
      pointsNeeded,
      progress: Math.min(progress, 100)
    };
  };

  const progressInfo = getProgressToNextReward();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Points & Rewards</h1>
        <p className="text-muted-foreground">
          Earn points and redeem them for premium features and benefits
        </p>
      </div>

      {/* Points Balance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
            <Coins className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userPoints.available.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to redeem</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPoints.lifetime.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime points</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Spent</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(userPoints.lifetime - userPoints.available).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">On rewards</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Reward */}
      {progressInfo && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Progress to Next Reward
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{progressInfo.reward.name}</p>
                <p className="text-sm text-muted-foreground">
                  You need {progressInfo.pointsNeeded} more points
                </p>
              </div>
              <Badge variant="outline">
                {progressInfo.reward.pointsRequired} points
              </Badge>
            </div>
            <Progress value={progressInfo.progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Available Rewards */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Redeem your points for these amazing rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => {
              const canRedeem = userPoints.available >= reward.pointsRequired && reward.available;
              const pointsNeeded = reward.pointsRequired - userPoints.available;
              const isRedeeming = selectedReward === reward.id;

              return (
                <Card 
                  key={reward.id} 
                  className={cn(
                    "relative border transition-all duration-200 hover:shadow-lg",
                    canRedeem ? "border-green-200 hover:border-green-300" : "border-border",
                    !reward.available && "opacity-50"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "p-2 rounded-lg",
                        reward.category === 'ai' && "bg-purple-100 text-purple-600",
                        reward.category === 'subscription' && "bg-blue-100 text-blue-600",
                        reward.category === 'feature' && "bg-amber-100 text-amber-600",
                        reward.category === 'premium' && "bg-emerald-100 text-emerald-600"
                      )}>
                        {reward.icon}
                      </div>
                      <Badge 
                        variant={canRedeem ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {reward.pointsRequired} pts
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold leading-none">
                        {reward.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {reward.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {canRedeem ? (
                      <Button 
                        onClick={() => handleRedeem(reward)}
                        disabled={isRedeeming}
                        className="w-full"
                        size="sm"
                      >
                        {isRedeeming ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Redeeming...
                          </>
                        ) : (
                          'Redeem Now'
                        )}
                      </Button>
                    ) : reward.available ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">
                            Need {pointsNeeded} more points
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Not Enough Points
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Redemption History */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Redemption History
          </CardTitle>
          <CardDescription>
            Your recent reward redemptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {redemptionHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward</TableHead>
                  <TableHead>Points Spent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptionHistory.map((redemption) => (
                  <TableRow key={redemption.id}>
                    <TableCell className="font-medium">
                      {redemption.rewardName}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {redemption.pointsSpent} pts
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(redemption.redeemedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={redemption.status === 'completed' ? 'default' : 
                                redemption.status === 'pending' ? 'secondary' : 'destructive'}
                        className="capitalize"
                      >
                        {redemption.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {redemption.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No redemptions yet</p>
              <p className="text-sm">Start earning points to redeem rewards!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
