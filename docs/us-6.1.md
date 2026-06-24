# US 6.1 — Display Earned Points (ABC-246)

## What

After an order reaches `Completed` (Delivered) status, show the earned loyalty points on the order detail page. Display a compact points balance card on the profile page. Points are earned at 1 pt per 10,000 VND spent.

## Backend API

### GET /api/loyalty/balance

Returns balance along with pending points and VND equivalent.

**Response:**
```json
{
    "isSuccess": true,
    "message": null,
    "data": {
        "balance": 25000,
        "pendingPoints": 5000,
        "discountEquivalent": 3000000,
        "lastUpdated": "2026-06-24T10:00:00Z"
    }
}
```

| Field | Type | Description |
|---|---|---|
| `balance` | int | Available points (completed, ready to use) |
| `pendingPoints` | int | Points from pending transactions (not yet settled) |
| `discountEquivalent` | int | VND monetary value (= (balance + pendingPoints) × 100) |
| `lastUpdated` | DateTime | Last update timestamp |

### Backend Event Flow (no frontend API change)

- `ProcessLoyaltyOnOrderConfirmedHandler` — on checkout, creates a **Pending** Earn transaction linked to the order
- `CompleteLoyaltyTransactionsOnOrderCompletedHandler` — on order Completed (Delivered), flushes pending → completed, moves points from pending to available

## Points Rate

| Property | Value |
|---|---|
| Earn rate | 10,000 VND spent = 1 point earned |

## Implementation Steps

### ST 6.1.1 — Points Display on Order Detail Page (when Completed)

**File:** `src/app/(shop)/orders/[id]/page.tsx`

When `order.status === OrderStatus.Completed`, compute earned points from the order total and display a callout.

**Earned points calculation (pure frontend):**
```ts
const earnedPoints = Math.floor(order.totalAmount / 10000)
```

**Placement:** Add below the order items section, in the price breakdown area.

**UI:**
```
┌───────────────────────────────────────┐
│  Items Subtotal             500,000   │
│  ───────────────────────────────────  │
│  Order Total                500,000   │
│                                       │
│  ★ You earned 53 points from this    │
│    order! They've been added to      │
│    your balance.                     │
└───────────────────────────────────────┘
```

**States:**
- **Completed order with points:** Show green callout with `Award`/`Coins` icon
- **Completed order, no points (total < 10,000):** Show muted "Points earned: 0"
- **Non-completed order:** Hide the section entirely
- **Error:** Silent (computation is local, no API call)

### ST 6.1.2 — Points Balance Card on Profile

**File:** `src/components/loyalty/PointsBalanceCard.tsx`

Rewrite the existing component to use the correct backend fields.

**Current props:**
```ts
interface PointsBalanceCardProps {
    availablePoints: number
    pendingPoints: number
    totalEarned?: number
}
```

**Corrected props:**
```ts
interface PointsBalanceCardProps {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    isLoading?: boolean
    error?: string | null
}
```

**Format:**
```
Loyalty Points
30,000 pts
5,000 pts pending
≈ 3,000,000 VND
```

**States:**
- **Loading:** Skeleton (shimmer lines)
- **Data:** Show balance + pending (if > 0) + VND equivalent
- **Error:** Return null (hidden)

**Data source:** `usePointsBalance()` from `@/hooks/usePoints` → `GET /api/loyalty/balance`

### Types to Fix

**File:** `src/types/loyalty.ts`

Current types need updating:

```ts
// BEFORE
export interface LoyaltyBalanceResponse {
    availablePoints: number
    pendingPoints: number
    totalEarned: number
    totalRedeemed: number
}

// AFTER — balance = available points, pendingPoints kept for pending transactions
export interface LoyaltyBalanceResponse {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    lastUpdated: string
}
```

### Data Flow

```
Order Detail (status = Completed)
  ↓
earnedPoints = Math.floor(order.totalAmount / 10000)
  ↓
Render "You earned X points from this order!"

Profile Page
  ↓
usePointsBalance() → GET /api/loyalty/balance
  ↓
PointsBalanceCard: "X pts (+ Y pending) (≈ X,000 VND)"
```
