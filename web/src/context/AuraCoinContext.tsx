'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  completed: boolean;
  type: 'daily' | 'weekly';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  city: string;
  coinsEarned: number;
  isCurrentUser?: boolean;
}

interface AuraCoinContextType {
  coins: number;
  streak: number;
  lastCheckIn: string | null;
  missions: Mission[];
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  claimDailyCheckIn: () => { success: boolean; coinsEarned: number; msg: string };
  completeMission: (id: string) => void;
  earnCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number) => boolean;
  unlockBadge: (id: string) => void;
}

const AuraCoinContext = createContext<AuraCoinContextType | undefined>(undefined);

export function AuraCoinProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(350); // Start with 350 AuraCoins
  const [streak, setStreak] = useState(2); // Start with a 2-day streak
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  const [missions, setMissions] = useState<Mission[]>([
    { id: 'm1', title: 'Place a Flado order', description: 'Order groceries or snacks on Flado express today.', rewardCoins: 100, completed: false, type: 'daily' },
    { id: 'm2', title: 'Review last order', description: 'Rate your recently completed order with photos.', rewardCoins: 50, completed: false, type: 'daily' },
    { id: 'm3', title: 'Browse 5 products', description: 'Discover new season drops or electronics catalog items.', rewardCoins: 20, completed: false, type: 'daily' },
    { id: 'm4', title: 'Share invite link', description: 'Spread the word about AuraMart with your crew.', rewardCoins: 75, completed: false, type: 'weekly' }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: 'b_first', name: 'First Buyer', description: 'Placed your very first order.', unlocked: true, icon: '🛍️', unlockedAt: '2026-06-20' },
    { id: 'b_flado', name: 'Flado Fanatic', description: 'Completed 10 express deliveries.', unlocked: false, icon: '⚡' },
    { id: 'b_review', name: 'Review King', description: 'Helped others by reviewing items.', unlocked: false, icon: '✍️' },
    { id: 'b_streak', name: 'Streak Master', description: 'Checked in 7 days consecutively.', unlocked: false, icon: '🔥' },
    { id: 'b_platinum', name: 'VIP Patron', description: 'Entered the Aura Platinum tier.', unlocked: false, icon: '💎' }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { rank: 1, name: 'Vikram S.', city: 'Pune', coinsEarned: 2450 },
    { rank: 2, name: 'Ananya R.', city: 'Hyderabad', coinsEarned: 1890 },
    { rank: 3, name: 'Arif Al N. (You)', city: 'Mumbai', coinsEarned: 1540, isCurrentUser: true },
    { rank: 4, name: 'Rahul S.', city: 'New Delhi', coinsEarned: 1210 },
    { rank: 5, name: 'Priya P.', city: 'Mumbai', coinsEarned: 950 }
  ]);

  // Read/write states to localStorage on client
  useEffect(() => {
    const savedCoins = localStorage.getItem('auramart_coins');
    const savedStreak = localStorage.getItem('auramart_streak');
    const savedCheckIn = localStorage.getItem('auramart_last_checkin');
    const savedMissions = localStorage.getItem('auramart_missions');
    const savedBadges = localStorage.getItem('auramart_badges');

    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedCheckIn) setLastCheckIn(savedCheckIn);
    if (savedMissions) setMissions(JSON.parse(savedMissions));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  const saveToStorage = (newCoins: number, newStreak: number, newCheckIn: string | null, newMissions = missions, newBadges = badges) => {
    localStorage.setItem('auramart_coins', String(newCoins));
    localStorage.setItem('auramart_streak', String(newStreak));
    if (newCheckIn) localStorage.setItem('auramart_last_checkin', newCheckIn);
    localStorage.setItem('auramart_missions', JSON.stringify(newMissions));
    localStorage.setItem('auramart_badges', JSON.stringify(newBadges));
  };

  const claimDailyCheckIn = () => {
    const todayStr = new Date().toDateString();
    if (lastCheckIn === todayStr) {
      return { success: false, coinsEarned: 0, msg: 'Already checked in today! Come back tomorrow.' };
    }

    // Reward scales up with streak: Day 1 (+10), Day 2 (+20)... Day 7 (+70)
    const nextStreak = streak >= 7 ? 1 : streak + 1;
    const coinsReward = nextStreak * 10;
    const newCoins = coins + coinsReward;
    
    setCoins(newCoins);
    setStreak(nextStreak);
    setLastCheckIn(todayStr);

    // If streak reaches 7, unlock streak master badge
    let updatedBadges = [...badges];
    if (nextStreak === 7) {
      updatedBadges = badges.map(b => b.id === 'b_streak' ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().substring(0,10) } : b);
      setBadges(updatedBadges);
    }

    // Sync leaderboard
    setLeaderboard(prev => prev.map(u => u.isCurrentUser ? { ...u, coinsEarned: u.coinsEarned + coinsReward } : u).sort((a,b) => b.coinsEarned - a.coinsEarned));

    saveToStorage(newCoins, nextStreak, todayStr, missions, updatedBadges);

    return { 
      success: true, 
      coinsEarned: coinsReward, 
      msg: `Daily check-in success! Earned +${coinsReward} AuraCoins. Streak is now ${nextStreak} Days 🔥` 
    };
  };

  const completeMission = (id: string) => {
    const targetMission = missions.find(m => m.id === id);
    if (!targetMission || targetMission.completed) return;

    const updatedMissions = missions.map(m => m.id === id ? { ...m, completed: true } : m);
    const newCoins = coins + targetMission.rewardCoins;
    
    setMissions(updatedMissions);
    setCoins(newCoins);

    saveToStorage(newCoins, streak, lastCheckIn, updatedMissions, badges);
  };

  const earnCoins = (amount: number, reason: string) => {
    if (amount <= 0) return;
    const newCoins = coins + amount;
    setCoins(newCoins);
    saveToStorage(newCoins, streak, lastCheckIn, missions, badges);
  };

  const spendCoins = (amount: number) => {
    if (amount <= 0 || coins < amount) return false;
    const newCoins = coins - amount;
    setCoins(newCoins);
    saveToStorage(newCoins, streak, lastCheckIn, missions, badges);
    return true;
  };

  const unlockBadge = (id: string) => {
    const updatedBadges = badges.map(b => b.id === id ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().substring(0,10) } : b);
    setBadges(updatedBadges);
    saveToStorage(coins, streak, lastCheckIn, missions, updatedBadges);
  };

  return (
    <AuraCoinContext.Provider
      value={{
        coins,
        streak,
        lastCheckIn,
        missions,
        badges,
        leaderboard,
        claimDailyCheckIn,
        completeMission,
        earnCoins,
        spendCoins,
        unlockBadge
      }}
    >
      {children}
    </AuraCoinContext.Provider>
  );
}

export function useAuraCoins() {
  const context = useContext(AuraCoinContext);
  if (context === undefined) {
    throw new Error('useAuraCoins must be used within an AuraCoinProvider');
  }
  return context;
}
